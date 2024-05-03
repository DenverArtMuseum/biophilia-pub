/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 * @property      {Object}  data Page data
 * @property      {String}  title Page title
 * @property      {String}  url Page url
 */
module.exports = function(eleventyConfig) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')

  return function(params) {
    const { currentURL, page } = params
    const { data, url } = page
    const { label, layout, title, linked_page } = data

    const titleText = pageTitle({ label, title })
    /**
     * Check if item is a reference to a built page or just a heading
     * @type {Boolean}
     */
    var isPage = !!layout 
    //if( linked_page ) isPage = linked_page  // does not work yet
    let thisURL = title == 'Object Plates' ?  false : url
    return ( isPage && thisURL )
      ? `<a href="${thisURL}" class="${currentURL === thisURL ? 'active' : ''}">${titleText}</a>`
      : `<a href="#!" class="no-link">${titleText}</a>`
  }
}
