import { candlestick } from 'd3fc-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import fc from 'd3fc';

export default function() {

  function drawCanvas(data, generator, canvas) {
    const ctx = canvas.getContext('2d');
    const drawCandlestick = generator.context(ctx);

    // Clear canvas
    canvas.width = canvas.width;

    ctx.beginPath();
    drawCandlestick(data.up);
    ctx.strokeStyle = '#52CA52';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    drawCandlestick(data.down);
    ctx.strokeStyle = '#E6443B';
    ctx.stroke();
    ctx.closePath();
  }
  function drawSvg(data, generator, svg) {
    d3.select(svg).select("path.up")
      .datum(data.up)
      .attr("d", generator);

    d3.select(svg).select("path.down")
      .datum(data.down)
      .attr("d", generator);
  }

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
};
