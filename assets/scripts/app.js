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
    element.scrollIntoView({ behavior: 'smooth' })
  }
  static addToDOM(element, destinationSelector) {
    const destination = document.getElementById(destinationSelector)
    destination.append(element)
  }
  static removeFromDOM(elementId) {
    document.getElementById(elementId).remove()
  }
}

// class DropArea {
//   constructor() {
//     this.getDropLocation()
//   }
//   getDropLocation() {
//     const location = document.getElementById('drop-to-delete')
//   }
// }

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
    document.getElementById(this.id).addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', this.id)
      event.dataTransfer.effectAllowed = 'move'
    })
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
    this.connectDroppable()
  }

  connectDroppable() {
    const list = document.querySelector(`#${this.type}-projects ul`)
    list.addEventListener('dragenter', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        list.parentElement.classList.add('droppable')
        event.preventDefault()
      }
    })
    list.addEventListener('dragover', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault()
      }
    })
    list.addEventListener('dragleave', event => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list)
        list.parentElement.classList.remove('droppable')
    })
    list.addEventListener('drop', event => {
      const projectId = event.dataTransfer.getData('text/plain')
      if (this.#_projects.find(p => p.id === projectId)) {
        return
      }
      document.getElementById(projectId).querySelector('button:last-of-type').click()
      list.parentElement.classList.remove('droppable')
    })
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
    // const dropArea = new DropArea()
    const activeList = new ProjectList('active')
    const finishedList = new ProjectList('finished')
    activeList.setSwitchFn(finishedList.addProject.bind(finishedList))
    finishedList.setSwitchFn(activeList.addProject.bind(activeList))
  }
}

App.init()
