const { html } = require('~lib/common-tags')

module.exports = function (eleventyConfig) {
  const { enableModal } = eleventyConfig.globalData.config.figures

  return ({ content, id, modalId, isAdditionalSlides }) => enableModal
    ? html`<a class="q-figure__modal-link${isAdditionalSlides ? ' q-figure__modal-link__additional-slides' : ''}" data-modal-identifier="${modalId}" href="#${id}" data-modal-additional-slides="${isAdditionalSlides ? 'true' : 'false'}">${content}</a>`
    : content
}
