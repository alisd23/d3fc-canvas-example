import { candlestick } from 'd3fc-shape';
import fc from 'd3fc';
import d3 from 'd3';

/**
 * Factory function to create candlestick series creator
 * @return {Function} - Series render function
 */
export default function() {
  let xScale = d3.scale.identity();
  let yScale = d3.scale.identity();

  /**
   * Use the generator with the given data to draw to the canvas
   */
  function drawCanvas(upData, downData, generator, canvas) {
    const ctx = canvas.getContext('2d');
    generator.context(ctx);

    // Clear canvas
    canvas.width = canvas.width;

    // We have to draw the up and down candlesticks in separate 'paths' so we can colour them separately (green for up, red for down).
    ctx.beginPath();
    generator(upData);
    ctx.strokeStyle = '#52CA52';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    generator(downData);
    ctx.strokeStyle = '#E6443B';
    ctx.stroke();
    ctx.closePath();
  }
  /**
   * Use the generator with the given data to draw to the SVG element
   */
  function drawSvg(upData, downData, generator, svg) {
    generator.context(null);
    d3.select(svg).select("path.up")
      .datum(upData)
      .attr("d", generator);

    d3.select(svg).select("path.down")
      .datum(downData)
      .attr("d", generator);
  }

  // Generator which can be reused for both canvas and svg rendering
  const generator = candlestick()
    .x((d, i) => xScale(d.date))
    .open((d) => yScale(d.open))
    .high((d) => yScale(d.high))
    .low((d) => yScale(d.low))
    .close((d) => yScale(d.close));

  /**
   * Render the candlestick chart on the given elements via a D3 selection
   */
  var candlestickSeries = function(selection) {

    selection.each(function(data) {
      const element = this;

      const upData = data.filter(d => d.open <= d.close);
      const downData = data.filter(d => d.open > d.close);

      const draw = fc.util.render(() => {
        // Check if element is a canvas
        element.getContext
          ? drawCanvas(upData, downData, generator, element)
          : drawSvg(upData, downData, generator, element);
      });

      draw();
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
