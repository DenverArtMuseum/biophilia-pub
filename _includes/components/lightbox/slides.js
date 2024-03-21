const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders image slides with captions for display in a <q-lightbox> element
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 *
 * @param      {Array} figures
 * @return     {String}  An HTML <img> element
 */
module.exports = function(eleventyConfig) {
  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')
  const figureTableElement = eleventyConfig.getFilter('figureTableElement')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')

  return async function(figures, modalIdentifier='modal-default') {
    if (!figures) return ''

    const slideElement = async (figure) => {
      const {
        aspect_ratio: aspectRatio='widescreen',
        caption,
        credit,
        id,
        isSequence,
        label,
        lightbox_additions: lightboxAdditions='',
        lightbox_mode: lightboxMode='include',
        mediaType,
        modal_id: modalId='modal-default'
      } = figure

      if (modalIdentifier != modalId) {
        return ''
      }

      const isAudio = mediaType === 'soundcloud'
      const isVideo = mediaType === 'video' || mediaType === 'vimeo' || mediaType === 'youtube'
      const isIgnored = mediaType === 'soundcloud' || mediaType === 'audiofile' || lightboxMode === 'exclude'

      // Why would we want audio in the modal lightbox? We wouldn't, that's why.
      if (isIgnored) {
        return ''
      }

      const figureElement = async (figure) => {
        switch (true) {
          case mediaType === 'soundcloud':
            return figureAudioElement(figure)
          case mediaType === 'table':
            return `<div class="overflow-container">${await figureTableElement(figure)}</div>`
          case isVideo:
            return figureVideoElement(figure)
          case mediaType === 'image':
          default:
            return figureImageElement(figure, { preset: 'zoom', interactive: true })
        }
      }

      const labelSpan = label
        ? html`<span class="q-lightbox-slides__caption-label">${markdownify(label)}</span>`
        : ''
      const captionAndCreditSpan = caption || credit
        ? html`<span class="q-lightbox-slides__caption-content">${caption ? markdownify(caption) : ''} ${credit ? markdownify(credit) : ''}</span>`
        : ''
      const captionElement = labelSpan.length || captionAndCreditSpan.length
        ? html`
          <div class="q-lightbox-slides__caption">
            ${labelSpan}
            ${captionAndCreditSpan}
          </div>
        `
        : ''
      const annotationsElement = !isSequence
        ? annotationsUI({ figure, lightbox: true })
        : ''

      const elementBaseClass = 'q-lightbox-slides__element'
      const elementClasses = [
        elementBaseClass,
        mediaType ? `${elementBaseClass}--${mediaType}` : '',
        isAudio ? `${elementBaseClass}--audio` : '',
        isVideo ? `${elementBaseClass}--video ${elementBaseClass}--${aspectRatio}` : ''
      ].join(' ')

      // Generate addition figures
      const getFigure = eleventyConfig.getFilter('getFigure')
      let additionalSlides = ''
      if (lightboxAdditions != '') {
        let idList = lightboxAdditions.split(/\s+|,\s*/)
        for (const addId of idList) {
          // need to load these ids into figure objects
          let addition = getFigure(addId)
          if (!addition) {
            logger.warn(`The figure id "${addId}" was found in additional figures for figure "${id}", but is not defined in "figures.yaml"`)
            return ''
          }
          additionalSlides += await slideElement(addition)
        }
      }

      return html`
        <div
          class="q-lightbox-slides__slide"
          data-lightbox-slide
          data-lightbox-slide-id="${id}"
        >
          <div class="${elementClasses}">
            ${await figureElement(figure)}
          </div>
          <div class="q-figure-slides__slide-ui">
            ${captionElement}
            ${annotationsElement}
          </div>
        </div>
        ${additionalSlides}
      `
    }

    const slideElements = async () => {
      let slides = ''
      for (const figure of figures) {
        slides += await slideElement(figure)
      }
      return slides
    }

    return html`
      <div class="q-lightbox-slides">
        ${await slideElements()}
      </div>
    `
  }
}
