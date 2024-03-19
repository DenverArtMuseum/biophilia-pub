const { html } = require('~lib/common-tags')

/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig) {
  const lightboxSlides = eleventyConfig.getFilter('lightboxSlides')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')

  return async function (figures) {
    if (!figures) return

    const defaultIdentifier = 'modal-default'

    const getModalId = async (figure) => {
      const {
        modal_id: modalId=defaultIdentifier
      } = figure

      if (modalId != defaultIdentifier) {
        return modalId
      }
    }

    const modalIds = async () => {
      let idList = new Array()
      idList.push(defaultIdentifier)
      for (const figure of figures) {
        let id = await getModalId(figure)
        if (idList.indexOf(id) === -1) {
          idList.push(id)
        }
      }
      return idList
    }

    const modalElement = async (modalId) => {
      return html`
        <q-modal id="${modalId}" class="q-modal__${modalId}">
          <q-lightbox>
            ${await lightboxSlides(figures, modalId)}
            ${lightboxUI(figures)}
          </q-lightbox>
          <button
            data-modal-close
            class="q-modal__close-button"
            id="close-modal"
          ></button>
        </q-modal>
      `
    }

    const modalElements = async () => {
      let modals = ''
      let idList = await modalIds
      for (const id of idList) {
        modals += await modalElement(id)
      }
      return modals
    }

    return await modalElements()

  }
}
