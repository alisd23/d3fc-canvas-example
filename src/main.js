import fc from 'd3fc';
import d3 from 'd3';
import { scaleLinear, scaleTime } from 'd3-scale';

import candlestickSeries from './candlestickSeries';
import '../sass/app.scss';

const canvasEl = document.getElementById('canvas');
const svgEl = document.getElementById('svg');
const selectEl = document.getElementById('points');

window.addEventListener('load', function() {
  d3.select(svg)
    .append('path')
    .attr('class', 'up');

  d3.select(svg)
    .append('path')
    .attr('class', 'down');

  const xScale = scaleTime();
  const yScale = scaleLinear();

  const series = candlestickSeries();

  let data = createData(Number(selectEl.value));

  renderCharts();

  // Listen for dropdown change
  selectEl.addEventListener('change', function() {
    data = createData(Number(selectEl.value));
    renderCharts();
  });

  window.addEventListener('resize', renderCharts);

  function renderCharts() {
    const width = document.getElementById('charts').clientWidth;
    const height = svgEl.clientHeight;
    canvasEl.width = width;
    canvasEl.height = height;

    d3.select(svg)
      .attr('width', width)
      .attr('height', height);

      setScales(data);

      series
        .xScale(xScale)
        .yScale(yScale);

      d3.selectAll('.chart')
        .datum(data)
        .call(series);
  }

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

  function setScales(data) {
    const width = document.getElementById('charts').clientWidth;
    const height = svgEl.clientHeight;
    canvasEl.width = width;
    canvasEl.height = height;

    xScale
      .range([0, width])
      .domain(d3.extent(data.all, (d, i) => d.date));
    yScale
      .range([height, 0])
      .domain(fc.util
        .extent()
        .fields(['high', 'low'])
        .pad(0.2)(data.all))
          .range([height, 0]);
  }
});
