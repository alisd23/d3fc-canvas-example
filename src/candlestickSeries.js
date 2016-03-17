import { candlestick } from 'd3fc-shape';
import fc from 'd3fc';
import d3 from 'd3';

function drawCanvas(data, generator, canvas) {
  generator.context(canvas.getContext('2d'));

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

  const up = d3.select(svg)
    .selectAll("path.up")
    .data([data.up]);
  
  up.enter()
    .append('path')
    .attr('class', 'up');
  
  up.attr("d", generator);
  
  const down = d3.select(svg)
    .selectAll("path.down")
    .data([data.down]);
  
  down.enter()
    .append('path')
    .attr('class', 'down');
  
  down.attr("d", generator);
}

export default function() {
  let xScale = d3.scale.identity();
  let yScale = d3.scale.identity();

  const generator = candlestick()
    .x((d, i) => xScale(d.date))
    .open((d) => yScale(d.open))
    .high((d) => yScale(d.high))
    .low((d) => yScale(d.low))
    .close((d) => yScale(d.close));

  const candlestickSeries = function(selection) {

    selection.each(function(data) {
      const element = this;

      // Check if element is a canvas
      const draw = element.getContext ? drawCanvas : drawSvg;
      draw(data, generator, element);
    });
  };

  candlestickSeries.xScale = (...args) => {
    if (!args.length) {
        return xScale;
    }
    xScale = args[0];
    return candlestickSeries;
  };
  candlestickSeries.yScale = (...args) => {
    if (!args.length) {
        return yScale;
    }
    yScale = args[0];
    return candlestickSeries;
  };

  return candlestickSeries;
};
