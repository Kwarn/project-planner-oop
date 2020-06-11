import { ProjectList } from "./assets/app/project-list.js";

class App {
  static init() {
    const activeList = new ProjectList('active')
    const finishedList = new ProjectList('finished')
    activeList.setSwitchFn(finishedList.addProject.bind(finishedList))
    finishedList.setSwitchFn(activeList.addProject.bind(activeList))
  }
}

App.init()
