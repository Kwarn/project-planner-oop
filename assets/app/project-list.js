import { Project } from './project.js'
import { DOMhelper } from '../utility/dom-helper.js'
export class ProjectList {
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
      try {
        if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list)
          list.parentElement.classList.remove('droppable')
      } catch {
        throw new Error('Item must be dropped into other list')
      }
    })
    list.addEventListener('drop', event => {
      const projectId = event.dataTransfer.getData('text/plain')
      if (this.#_projects.find(p => p.id === projectId)) {
        return
      }
      const project = document.getElementById(projectId)
      DOMhelper.clearEventListeners(project)
      project.querySelector('button:last-of-type').click()
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
