const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an image with a caption and annotations UI
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} figure          The figure object
 *
 * @return     {String}  HTML containing  a `figureImageElement`, a caption and annotations UI
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return async function(figure) {
    const {
      caption,
      credit,
      id,
      isSequence,
      label,
      lightbox_additions: lightboxAdditions='',
      modal_id: modalId='modal-default'
    } = figure

    let modalIdentifier = modalId

    const labelElement = figureLabel({ id, label, isSequence })

    /**
     * Wrap image in modal link
     */
    let isAdditionalSlides = false
    if (lightboxAdditions != '') {
      isAdditionalSlides = true
    }
    let imageElement = await figureImageElement(figure, { interactive: false })
    imageElement = figureModalLink({ content: imageElement, id, modalId: modalIdentifier, isAdditionalSlides })

    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      ${imageElement}
      ${captionElement}
    `
  }
}
