import { DOMhelper } from '../utility/dom-helper'
import { Tooltip } from './tooltip';

export class Project {
  constructor(id, switchHandler, tooltipText, type) {
    this.hasTooltip = false
    this.id = id
    this.switchHandler = switchHandler
    this.tooltipText = tooltipText
    this.type = type
    this.connectSwitchButton()
    this.connectToolTipBtn()
    this.connectDrag()
  }

  resetHasTooltip() {
    this.hasTooltip = false
  }

  showToolTip() {
    if (this.hasTooltip) {
      Tooltip.removeTooltip(this.id)
      this.resetHasTooltip()

      return
    }
    Tooltip.addTooltip(
      Tooltip.createTooltip(
        this.id,
        this.tooltipText,
        this.resetHasTooltip.bind(this)
      ),
      this.id
    )
    this.hasTooltip = true
  }

  connectDrag() {
    const projectElement = document.getElementById(this.id)
    const parentList = projectElement.closest('ul')
    projectElement.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.id)
      event.dataTransfer.effectAllowed = 'move'
    })
    projectElement.addEventListener('dragend', () => {
      parentList.parentElement.classList.remove('droppable')
    })
  }

  connectToolTipBtn() {
    this.resetHasTooltip()
    const btn = document.getElementById(this.id).querySelector('button')
    btn.addEventListener('click', this.showToolTip.bind(this))
  }

  connectSwitchButton() {
    let btn = document.getElementById(this.id).querySelectorAll('button')[1]
    btn = DOMhelper.clearEventListeners(btn)
    btn.addEventListener('click', this.switchHandler.bind(null, this.id))
  }

  update(switchHandler) {
    this.switchHandler = switchHandler
    this.connectSwitchButton()
    this.connectDrag()
  }
}
