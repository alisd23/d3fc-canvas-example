import { candlestick } from 'd3fc-shape';
import fc from 'd3fc';
import d3 from 'd3';

export default function() {
  let xScale = d3.scale.identity();
  let yScale = d3.scale.identity();

  function drawCanvas(data, generator, canvas) {
    const ctx = canvas.getContext('2d');
    generator.context(ctx);

    // Clear canvas
    canvas.width = canvas.width;

    ctx.beginPath();
    generator(data.up);
    ctx.strokeStyle = '#52CA52';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    generator(data.down);
    ctx.strokeStyle = '#E6443B';
    ctx.stroke();
    ctx.closePath();
  }
  function drawSvg(data, generator, svg) {
    generator.context(null);
    d3.select(svg).select("path.up")
      .datum(data.up)
      .attr("d", generator);

    d3.select(svg).select("path.down")
      .datum(data.down)
      .attr("d", generator);
  }

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
};
