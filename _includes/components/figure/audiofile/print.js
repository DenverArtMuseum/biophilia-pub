const { html } = require('~lib/common-tags')

/**
 * Renders an audio player for static audio files (not soundcloud)
 * TODO: basically render nothing
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  Content of referenced table file and a caption
 */
module.exports = function(eleventyConfig) {

  return async function({ audio_src, id, title }) {
    return html``
  }
}
