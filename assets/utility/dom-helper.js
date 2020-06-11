export class DOMhelper {
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