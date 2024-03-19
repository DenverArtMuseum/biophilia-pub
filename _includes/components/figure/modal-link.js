const { html } = require('~lib/common-tags')

module.exports = function (eleventyConfig) {
  const { enableModal } = eleventyConfig.globalData.config.figures

  return ({ content, id, modalId }) => enableModal
    ? html`<a class="q-figure__modal-link" data-modal-identifier="${modalId}" href="#${id}">${content}</a>`
    : content
}
