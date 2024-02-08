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

  const { imageDir } = eleventyConfig.globalData.config.figures

  return function({
    audio_src,
    id,
    title
  }) {

    const AudiofileEl = figureAudiofile({id,audio_src,title}) 

    return html`<div class="q-figure__media-wrapper audiofile-container">${AudiofileEl}</div>`

  }
}