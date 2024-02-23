const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * CanvasPanel shortcode that renders the Digirati <canvas-panel> web component
 * @see {@link https://iiif-canvas-panel.netlify.app/docs/intro/ Canvas Panel Documentation}
 */
module.exports = function(eleventyConfig) {
  const logger = chalkFactory('shortcodes:canvasPanel')

  /**
   * Canvas Panel Shortcode
   *
   * @param  {Object} params `figure` data from `figures.yaml`
   * @property  {String} canvasId The id of the canvas to render
   * @property  {String} choiceId The id of the choice to use as default (optional, and only applicable to canvases with choices)
   * @property  {String} id The id property of the figure in figures.yaml
   * @property  {String} manifestId The id of the manifest to render
   * @property  {String} preset <canvas-panel> preset {@link https://iiif-canvas-panel.netlify.app/docs/examples/responsive-image#presets}
   *
   * @return {String}        <canvas-panel> markup
   */
  return function(data) {
    const {
      canvasId,
      choiceId,
      height='',
      id,
      iiifContent,
      manifestId,
      preset='responsive',
      region='',
      virtualSizes='',
      width=''
    } = data

    if (!manifestId && !iiifContent) {
      logger.error(`Invalid params for figure "${id}": `, data)
      return ''
    }

    return html`
      <canvas-panel
        id="canvas-${id}"
        canvas-id="${canvasId}"
        choice-id="${choiceId}"
        height="${height}"
        iiif-content="${iiifContent}"
        manifest-id="${manifestId}"
        preset="${preset}"
        region="${region}"
        virtual-sizes="${virtualSizes}"
        width="${width}"
      />
      <div class="canvas-panel-ui">
        <button class="canvas-panel-ui-button canvas-panel-ui-zoom-in" aria-labelledby="${id}-label-zoom-in" onClick="document.querySelector('#canvas-${id}').zoomIn()">
          <span id="${id}-label-zoom-in" hidden>Zoom In</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 82 82"><g fill="#FFF" transform="translate(13 13)"><path d="M55.223 50.226l-16.75-16.749a21.092 21.092 0 0 0 3.936-12.273C42.409 9.494 32.915 0 21.204 0 9.494 0 0 9.494 0 21.204c0 11.708 9.494 21.204 21.204 21.204 4.579 0 8.806-1.465 12.272-3.934l16.75 16.75a2.65 2.65 0 0 0 3.748 0l1.25-1.25a2.649 2.649 0 0 0 0-3.748zm-34.02-14.888c-7.807 0-14.137-6.33-14.137-14.136 0-7.807 6.33-14.136 14.137-14.136 7.806 0 14.136 6.33 14.136 14.136 0 7.807-6.33 14.136-14.136 14.136z"/><path d="M22.97 12.369L19.436 12.369 19.436 19.437 12.367 19.437 12.367 22.971 19.436 22.971 19.436 30.037 22.97 30.037 22.97 22.971 30.038 22.971 30.038 19.437 22.97 19.437z"/></g></svg>
        </button>
        <button class="canvas-panel-ui-button canvas-panel-ui-zoom-out" aria-labelledby="${id}-label-zoom-out" onClick="document.querySelector('#canvas-${id}').zoomOut()">
          <span id="${id}-label-zoom-out" hidden>Zoom Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 82 82"><g fill="#FFF" transform="translate(13 13)"><path d="M55.223 50.226l-16.75-16.749a21.092 21.092 0 0 0 3.936-12.273C42.409 9.494 32.915 0 21.204 0 9.494 0 0 9.494 0 21.204c0 11.708 9.494 21.204 21.204 21.204 4.579 0 8.806-1.465 12.272-3.934l16.75 16.75a2.65 2.65 0 0 0 3.748 0l1.25-1.25a2.649 2.649 0 0 0 0-3.748zm-34.02-14.888c-7.807 0-14.137-6.33-14.137-14.136 0-7.807 6.33-14.136 14.137-14.136 7.806 0 14.136 6.33 14.136 14.136 0 7.807-6.33 14.136-14.136 14.136z"/><path d="M12.293 19.122L12.293 22.537 30.049 22.537 30.049 19.122"/></g></svg>
        </button>
        <button class="canvas-panel-ui-button canvas-panel-ui-reset" aria-labelledby="${id}-label-reset" onClick="document.querySelector('#canvas-${id}').goHome()">
          <span id="${id}-label-reset" hidden>Reset View</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 82 82"><g fill="#FFF"><path d="M46.6 43.6a5.6 5.6 0 0 1 5.6 5.6V66a5.6 5.6 0 0 1-5.6 5.6H35.4a5.6 5.6 0 0 1-5.6-5.6V49.2a5.6 5.6 0 0 1 5.6-5.6h11.2zm0 5.6H35.4V66h11.2V49.2z"/><path d="M41 10l28 25.2V66c0 3.733-1.867 5.6-5.6 5.6H18.6c-3.733 0-5.6-1.867-5.6-5.6V35.2L41 10zm0 7.532L18.6 37.689V66h44.8V37.692L41 17.532z"/></g></svg>
        </button>
      </div>
    `
  }
}
