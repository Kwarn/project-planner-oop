class Tooltip {
  static createTooltip(id, tooltipText, removeTooltipCallback) {
    const tooltip = document.createElement('div')
    tooltip.id = `${id}-tooltip`
    tooltip.innerHTML = `
    <p>${tooltipText}</p>`
    tooltip.addEventListener('click', removeTooltipCallback)
    return tooltip
  }
}

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
    console.log(element, destinationSelector)
    const destination = document.querySelector(destinationSelector)
    destination.append(element)
  }
  static removeFromDOM(elementId) {
    document.getElementById(elementId).remove()
  }
}

class Project {
  #hasTooltip = false
  constructor(id, switchHandler, tooltipText, type) {
    this.id = id
    this.switchHandler = switchHandler
    this.tooltipText = tooltipText
    this.type = type
    this.connectSwitchButton()
    this.connectToolTipBtn()
  }

  removeTooltip() {
    console.log('remove')
    if (!this.#hasTooltip) return
    DOMhelper.removeFromDOM(`${this.id}-tooltip`)
    this.#hasTooltip = false
  }

  showToolTip() {
    if (this.#hasTooltip) return

    const tooltip = Tooltip.createTooltip(
      this.id,
      this.tooltipText,
      this.removeTooltip.bind(this)
    )
    DOMhelper.addToDOM(tooltip, `#${this.id}`)
    this.#hasTooltip = true
  }

  connectToolTipBtn() {
    const btn = document.getElementById(this.id).querySelector('button')
    console.log(btn)
    btn.addEventListener('click', this.showToolTip.bind(this))
  }

  connectSwitchButton() {
    let btn = document.getElementById(this.id).querySelectorAll('button')[1]
    btn = DOMhelper.clearEventListeners(btn)
    btn.textContent = this.type === "active" ? "Finish" : "Activate"
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
      console.dir(project)
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

  addProject(project) {
    this.#_projects.push(project)
    DOMhelper.moveElement(project.id, `#${this.type}-projects ul`)
    project.update(this.switchHandler.bind(this))
  }

  setSwitchFn(fn) {
    this.switch = fn
  }

  switchHandler(id) {
    this.switch(this.#_projects.find(p => p.id === id))
  }
}

class App {
  static init() {
    const activeList = new ProjectList('active')
    const finishedList = new ProjectList('finished')
    activeList.setSwitchFn(finishedList.addProject.bind(finishedList))
    finishedList.setSwitchFn(activeList.addProject.bind(activeList))
  }
}

App.init()
