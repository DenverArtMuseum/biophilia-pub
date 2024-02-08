const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Renders an audio player for static audio files (not soundcloud)
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  HTML containing a video player and a caption
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function({
    id,
    audio_src,
    title
  }) {

    const audioSrc = audio_src.startsWith('http')
      ? audio_src
      : path.join(imageDir,audio_src)

    return html`<div id="audio-player-${ id }" class="audio-player-container">
      <audio id="audio-player-file-${ id }" class="audio-file" src="${ audioSrc }" preload="metadata"></audio>
      <div class="title-block">
        <p id="audio-player-title-${ id }" class="track-title">
          ${ title }
        </p>
      </div>
      <div class="play-block">
        <button id="audio-player-play-button-${ id }" class="play-pause-button paused">Play</button>
        <span id="audio-player-current-time-${ id }" class="time current-time">0:00</span>
        <input type="range" id="audio-player-seek-slider-${ id }" class="seek-slider" max="100" value="0">
        <span id="audio-player-duration-${ id }" class="time duration">0:00</span>
      </div>
      <div class="volume-block">
        <button id="audio-player-mute-player-${ id }" class="mute-button unmuted">Mute</button>
        <input type="range" id="audio-player-volume-slider-${ id }" class="volume-slider" max="100" value="100">
        <output id="audio-player-volume-output-${ id }" class="volume-output">100</output>
      </div>
  </div>`

  }
}