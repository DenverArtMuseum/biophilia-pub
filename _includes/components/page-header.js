const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Publication page header
 *
 *  Added hero-credit - Darcy Christ
 * 
 * @param      {Object}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  const { labelDivider } = eleventyConfig.globalData.config.pageTitle
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function (params) {
    const {
      byline_format: bylineFormat,
      image,
      image_credit,
      object,
      label,
      pageContributors,
      subtitle,
      title
    } = params

    const classes = ['quire-page__header', 'hero']

    if (title == 'title page' || title == 'half title page') {
      classes.push('is-screen-only')
    }

    const pageLabel = label
      ? `<span class="label">${label}<span class="visually-hidden">${labelDivider}</span></span>`
      : ''

    const imageCredit = image_credit
      ? html`
          <div class="hero-credit">
           <span class="hero-credit-icon"></span>
           <span class="hero-credit-text">${image_credit}</span>
          </div>
        `
      : ''

    const imageElement = image
      ? html`
          <section
            class="${classes} hero-image hero__image"
           style="background-image: url('${path.join(imageDir, image)}');"
          >
           ${imageCredit}
          </section>
        `
      : ''

    const contributorsElement = pageContributors
      ? html`
          <div class="quire-page__header__contributor">
            ${contributors({ context: pageContributors, format: bylineFormat })}
          </div>
        `
      : ''

    return html`
      <section class="${classes}">
        <div class="hero-body">
          <h1 class="quire-page__header__title" id="${slugify(title)}">
            ${pageLabel}
            ${pageTitle({ title, subtitle })}
          </h1>
          ${contributorsElement}
        </div>
      </section>
      ${imageElement}
    `
  }
}
