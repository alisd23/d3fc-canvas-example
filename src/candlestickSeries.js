import { candlestick } from 'd3fc-shape';
<<<<<<< HEAD
import fc from 'd3fc';
import d3 from 'd3';

export default function() {
  let xScale = d3.scale.identity();
  let yScale = d3.scale.identity();

  function drawCanvas(data, generator, canvas) {
    const ctx = canvas.getContext('2d');
    generator.context(ctx);
=======
import { scaleLinear, scaleTime } from 'd3-scale';
import fc from 'd3fc';

export default function() {

  function drawCanvas(data, generator, canvas) {
    const ctx = canvas.getContext('2d');
    const drawCandlestick = generator.context(ctx);
>>>>>>> 1b1b7ec... Finished

    // Clear canvas
    canvas.width = canvas.width;

    ctx.beginPath();
<<<<<<< HEAD
    generator(data.up);
=======
    drawCandlestick(data.up);
>>>>>>> 1b1b7ec... Finished
    ctx.strokeStyle = '#52CA52';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
<<<<<<< HEAD
    generator(data.down);
=======
    drawCandlestick(data.down);
>>>>>>> 1b1b7ec... Finished
    ctx.strokeStyle = '#E6443B';
    ctx.stroke();
    ctx.closePath();
  }
  function drawSvg(data, generator, svg) {
<<<<<<< HEAD
    generator.context(null);
=======
>>>>>>> 1b1b7ec... Finished
    d3.select(svg).select("path.up")
      .datum(data.up)
      .attr("d", generator);

    d3.select(svg).select("path.down")
      .datum(data.down)
      .attr("d", generator);
  }

<<<<<<< HEAD
  const generator = candlestick()
    .x((d, i) => xScale(d.date))
    .open((d) => yScale(d.open))
    .high((d) => yScale(d.high))
    .low((d) => yScale(d.low))
    .close((d) => yScale(d.close));


  var candlestickSeries = function(selection) {

    selection.each(function(data) {
      const element = this;
      const event = d3.dispatch('zoom');
      const zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
          .on('zoom', function() {
            event.zoom.call(this, xScale.domain(), yScale.domain());
            draw();
          });
=======
  return function(selection) {
    selection.each(function(data) {
      const element = this;

      const xScale = scaleTime()
        .range([0, element.clientWidth])
        .domain(d3.extent(data.all, (d, i) => d.date));

      const yScale = scaleLinear()
        .range([element.clientHeight, 0])
        .domain(fc.util
          .extent()
          .fields(['high', 'low'])
          .pad(0.2)(data.all));

      const generator = candlestick()
        .x((d, i) => xScale(d.date))
        .open((d) => yScale(d.open))
        .high((d) => yScale(d.high))
        .low((d) => yScale(d.low))
        .close((d) => yScale(d.close));

      const event = d3.dispatch('zoom');

      const zoom = d3.behavior.zoom()
        .on('zoom', function() {
          event.zoom.call(this, xScale.domain(), yScale.domain());
          draw(data, generator, element);
        })
        .x(xScale)
        .y(yScale);
>>>>>>> 1b1b7ec... Finished

      d3.select(element).call(zoom);

      const draw = fc.util.render(() => {
        // Check if element is a canvas
        element.getContext
          ? drawCanvas(data, generator, element)
          : drawSvg(data, generator, element);
      });

      draw();
    });
  };
<<<<<<< HEAD

  candlestickSeries.xScale = function(x) {
    if (!x) {
        return xScale;
    }
    xScale = x;
    return candlestickSeries;
  };
  candlestickSeries.yScale = function(x) {
    if (!x) {
        return yScale;
    }
    yScale = x;
    return candlestickSeries;
  };

  return candlestickSeries;
=======
>>>>>>> 1b1b7ec... Finished
};
