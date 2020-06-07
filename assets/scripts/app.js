class DOMhelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true)
    element.replaceWith(clonedElement)
    return clonedElement
  }
  static moveElement(elementId, destinationSelector) {
    const element = document.getElementById(elementId)
    const destination = document.querySelector(destinationSelector)
    destination.append(element)
  }
  static addToDOM(element, destinationSelector) {
    const destination = document.getElementById(destinationSelector)

    destination.append(element)
  }
  static removeFromDOM(elementId) {
    document.getElementById(elementId).remove()
  }
}

class DropArea{
  constructor(){
    this.getDropLocation()
  }
  getDropLocation(){
    const location = document.getElementById('drop-to-delete')
    location.addEventListener('d')
  }
}

class Tooltip {
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

class Project extends Tooltip {
  #hasTooltip = false
  constructor(id, switchHandler, tooltipText, type) {
    super()
    this.id = id
    this.switchHandler = switchHandler
    this.tooltipText = tooltipText
    this.type = type
    this.connectSwitchButton()
    this.connectToolTipBtn()
    this.connectDrag()
  }

  resetHasTooltip() {
    this.#hasTooltip = false
  }

  showToolTip() {
    if (this.#hasTooltip) {
      this.removeTooltip(this.id)
      this.resetHasTooltip()
      return
    }
    this.addTooltip(
      this.createTooltip(
        this.id,
        this.tooltipText,
        this.resetHasTooltip.bind(this)
      ),
      this.id
    )
    this.#hasTooltip = true
  }

  connectDrag() {
    document.getElementById(this.id).addEventListener('dragstart')
  }

  connectToolTipBtn() {
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
  }
}

class ProjectList {
  #_projects = []
  constructor(type) {
    this.type = type
    const projects = document.querySelectorAll(`#${this.type}-projects li`)
    for (const project of projects) {
      project.draggable = true
      this.#_projects.push(
        new Project(
          project.id,
          this.switchHandler.bind(this),
          project.dataset.extraInfo,
          this.type
        )
      )
    }
  }
  updateButtonText(projectId) {
    const btn = document.getElementById(projectId).querySelectorAll('button')[1]
    btn.textContent = this.type === 'active' ? 'Finish' : 'Activate'
  }

  addProject(project) {
    this.updateButtonText(project.id)
    this.#_projects.push(project)
    DOMhelper.moveElement(project.id, `#${this.type}-projects ul`)
    project.update(this.switchHandler.bind(this))
  }

  setSwitchFn(fn) {
    this.switch = fn
  }

  switchHandler(id) {
    this.switch(this.#_projects.find(p => p.id === id))
    this.#_projects = this.#_projects.filter(p => p.id !== id)
  }
}

class App {
  static init() {
    const dropArea = new DropLocation()
    const activeList = new ProjectList('active')
    const finishedList = new ProjectList('finished')
    activeList.setSwitchFn(finishedList.addProject.bind(finishedList))
    finishedList.setSwitchFn(activeList.addProject.bind(activeList))
  }
}

App.init()