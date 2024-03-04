const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an audio player for static audio files (not soundcloud)
 * TODO: This whole file
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  HTML containing a video player and a caption
 */
module.exports = function(eleventyConfig) {
  const figureAudiofile = eleventyConfig.getFilter('figureAudiofileElement')
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function({
    audio_src,
    caption,
    credit,
    id,
    isSequence,
    label,
    title
  }) {

    const AudiofileEl = figureAudiofile({id,audio_src,title}) 
    const labelElement = figureLabel({ id, label, isSequence })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`<div class="q-figure__media-wrapper audiofile-container">${AudiofileEl}${captionElement}</div>`

  }
}