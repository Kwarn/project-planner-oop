import { DOMhelper } from '../utility/dom-helper'

export class Tooltip {
  static createTooltip(id, tooltipText, resetHasTooltipCb) {
    const tooltip = document.createElement('div')
    tooltip.id = `${id}-tooltip`
    tooltip.innerHTML = `
    <p>${tooltipText}</p>`
    tooltip.addEventListener(
      'click',
      () => this.removeTooltip(id, resetHasTooltipCb)
    )

    return tooltip
  }

  static addTooltip(element, hostElementId) {
    this.element = element
    DOMhelper.addToDOM(element, hostElementId)
  }

  static removeTooltip(id, resetHasTooltipCb) {
    DOMhelper.removeFromDOM(`${id}-tooltip`)
    if (resetHasTooltipCb) {
      resetHasTooltipCb()
    }
  }
}
