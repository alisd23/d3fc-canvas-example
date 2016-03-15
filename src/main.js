
import { candlestick } from 'd3fc-shape';
import fc from 'd3fc';
import d3 from 'd3'
import { scaleLinear, scaleTime } from 'd3-scale';

import Canvas from './Canvas';
import Svg from './Svg';
import '../sass/app.scss';

const canvasEl = document.getElementById('canvas');
const svgEl = document.getElementById('svg');
const selectEl = document.getElementById('points');

const width = svgEl.clientWidth;
const height = svgEl.clientHeight;

const rawData = createData(6000);
const data = {
  up: rawData.filter(d => d.open <= d.close),
  down: rawData.filter(d => d.open > d.close)
};

let xScale = createXScale(rawData);
let yScale = createYScale(rawData);

const generator = candlestick()
  .x((d, i) => xScale(d.date))
  .open((d) => yScale(d.open))
  .high((d) => yScale(d.high))
  .low((d) => yScale(d.low))
  .close((d) => yScale(d.close));

const canvas = new Canvas(generator, data, width, xScale, yScale, 'canvas');
const svg = new Svg(generator, data, xScale, yScale);


selectEl.addEventListener('change', () => {
  const newRawData = createData(Number(selectEl.value));
  const newData = {
    up: newRawData.filter(d => d.open <= d.close),
    down: newRawData.filter(d => d.open > d.close)
  };
  xScale = createXScale(newRawData);
  yScale = createYScale(newRawData);

  canvas.setData(data, xScale, yScale);
  canvas.draw();
});

/**
 * Data creation function
 * @param  {Number}   count - Number of data points
 * @return {Object[]} data
 */
function createData(count) {
  const ohlcDataGenerator = fc.data.random.financial()
      .startDate(new Date(2014, 1, 1));

  return ohlcDataGenerator(count);
}

function createXScale(data) {
  return scaleTime()
    .range([0, width])
    .domain(d3.extent(data, (d, i) => d.date));
}
function createYScale(data) {
  return scaleLinear()
    .range([height, 0])
    .domain(fc.util
      .extent()
      .fields(['high', 'low'])
      .pad(0.2)(rawData));
}
