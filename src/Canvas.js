import fc from 'd3fc';

/**
 * Canvas rendering class
 */
export default class Canvas {

  /**
   * Setup Canvas
   * @param  {Function} generator - Generates the candlestick canvas path
   * @param  {Object} data        - Chart data ({ up, down })
   * @param  {Function} xScale
   */
  constructor(generator, data, width, xScale, yScale) {
    const self = this;
    this.d3Canvas = d3.select('#canvas');
    this.canvas = document.getElementById('canvas');
    this.canvas.width = width;
    this.ctx = this.canvas.getContext('2d');
    this.generator = generator;

    this.setData(data, xScale, yScale);

    const event = d3.dispatch('zoom');

    const zoom = d3.behavior.zoom()
      .on('zoom', function() {
        event.zoom.call(this, self.xScale.domain());
        event.zoom.call(this, self.yScale.domain());
        self.draw();
      })
      .x(this.xScale)
      .y(this.yScale);

    this.d3Canvas.call(zoom);

    // Initial draw
    this.draw();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setData(data, xScale, yScale) {
    this.data = data;
    this.xScale = xScale;
    this.yScale = yScale;
  }

  draw() {
    fc.util.render(() => {
      const drawCandlestick = this.generator.context(this.ctx);
      this.clear();

      this.ctx.beginPath();
      drawCandlestick(this.data.up);
      this.ctx.strokeStyle = '#77DD77';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.beginPath();
      drawCandlestick(this.data.down);
      this.ctx.strokeStyle = '#ff6961';
      this.ctx.stroke();
      this.ctx.closePath();
    })();
  }
}
