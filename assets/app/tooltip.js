import {DOMhelper} from "../utility/dom-helper.js"

export class Tooltip {
  constructor() {}

  createTooltip(id, tooltipText, resetHasTooltipCb) {
    const tooltip = document.createElement('div')
    tooltip.id = `${id}-tooltip`
    tooltip.innerHTML = `
    <p>${tooltipText}</p>`
    tooltip.addEventListener(
      'click',
      this.removeTooltip.bind(null, id, resetHasTooltipCb)
    )
    return tooltip
  }

  addTooltip(element, hostElementId) {
    DOMhelper.addToDOM(element, hostElementId)
  }

  removeTooltip(id, resetHasTooltipCb) {
    DOMhelper.removeFromDOM(`${id}-tooltip`)
    if (resetHasTooltipCb) resetHasTooltipCb()
  }
}