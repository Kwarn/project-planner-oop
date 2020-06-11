import { DOMhelper } from '../utility/dom-helper'
import { Project } from './project'

export class ProjectList {
  constructor(type) {
    this.projects = []
    this.type = type
    const projects = document.querySelectorAll(`#${this.type}-projects li`)
    for (const project of projects) {
      project.draggable = true
      this.projects.push(new Project(
          project.id,
          this.switchHandler.bind(this),
          project.dataset.extraInfo,
          this.type
        ))
    }
    this.connectDroppable()
  }

  connectDroppable() {
    const list = document.querySelector(`#${this.type}-projects ul`)
    list.addEventListener('dragenter', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        list.parentElement.classList.add('droppable')
        event.preventDefault()
      }
    })
    list.addEventListener('dragover', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault()
      }
    })
    list.addEventListener('dragleave', (event) => {
      try {
        if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
 list.parentElement.classList.remove('droppable')
}
      } catch {
        throw new Error('Item must be dropped into other list')
      }
    })
    list.addEventListener('drop', (event) => {
      const projectId = event.dataTransfer.getData('text/plain')
      if (this.projects.find((project) => project.id === projectId)) {
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
    this.projects.push(project)
    DOMhelper.moveElement(project.id, `#${this.type}-projects ul`)
    project.update(this.switchHandler.bind(this))
  }

  setSwitchFn(fn) {
    this.switch = fn
  }

  switchHandler(id) {
    this.switch(this.projects.find((project) => project.id === id))
    this.projects = this.projects.filter((project) => project.id !== id)
  }
}
