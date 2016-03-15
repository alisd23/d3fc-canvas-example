import fc from 'd3fc';
import d3 from 'd3'

import candlestickSeries from './candlestickSeries';
import '../sass/app.scss';

const canvasEl = document.getElementById('canvas');
const svgEl = document.getElementById('svg');
const selectEl = document.getElementById('points');

const width = document.body.clientWidth;
const height = svgEl.clientHeight;
canvasEl.width = width;

d3.select(svg)
  .attr('width', width)
  .append('path')
  .attr('class', 'up');

d3.select(svg)
  .append('path')
  .attr('class', 'down');

const data = createData(Number(selectEl.value));

const series = candlestickSeries();

d3.selectAll('.chart')
  .datum(data)
  .call(series);

// Listen for dropdown change
selectEl.addEventListener('change', () => {
  const newData = createData(Number(selectEl.value));

  d3.selectAll('.chart')
    .datum(newData)
    .call(series);
});


/**
 * Data creation function
 * @param  {Number}   count - Number of data points
 * @return {Object[]} data
 */
function createData(count) {
  const ohlcDataGenerator = fc.data.random.financial()
      .startDate(new Date(2014, 1, 1));

  const data = ohlcDataGenerator(count);

  return {
    all: data,
    up: data.filter(d => d.open <= d.close),
    down: data.filter(d => d.open > d.close)
  };
}
