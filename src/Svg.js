import fc from 'd3fc';

/**
 * SVG rendering class
 */
export default class Svg {

  /**
   * Setup SVG
   * @param  {Function} generator - Generates the candlestick canvas path
   * @param  {Object} data        - Chart data ({ up, down })
   * @param  {Function} xScale
   */
  constructor(generator, data, xScale, yScale) {
    const self = this;
    this.svg = d3.select('#svg');
    this.generator = generator;
    this.data = data;

    this.svg
      .append('path')
      .attr('class', 'up');

    this.svg
      .append('path')
      .attr('class', 'down');

    const event = d3.dispatch('zoom');

    const zoom = d3.behavior.zoom()
      .on('zoom', function() {
        event.zoom.call(this, xScale.domain());
        event.zoom.call(this, yScale.domain());
        self.draw();
      })
      .x(xScale)
      .y(yScale);

    this.svg.call(zoom);

    // Initial draw
    this.draw();
  }

  draw() {
    fc.util.render(() => {
      const drawCandlestick = this.generator.context(null);
      this.svg.select("path.up")
        .datum(this.data.up)
        .attr("d", drawCandlestick);

      this.svg.select("path.down")
        .datum(this.data.down)
        .attr("d", drawCandlestick);
    })();
  }
}
