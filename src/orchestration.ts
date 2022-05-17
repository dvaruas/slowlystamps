import { StampElement } from "./element";
import { PageNumberClass } from "./selectors";

class PageElement {
  public readonly element: HTMLLIElement;

  constructor(
    pageNumber: number,
    displayArea: HTMLDivElement,
    displayElements: StampElement[],
    registerActiveElement: (e: PageElement) => void
  ) {
    // Create the pagination element
    let element = document.createElement("li");
    element.classList.add("page-item", PageNumberClass);
    element.innerHTML = `<a class="page-link">${pageNumber}</a>`;
    element.onclick = () => {
      displayArea.innerHTML = "";
      displayElements.forEach((elem) => {
        displayArea.appendChild(elem.element);
      });
      registerActiveElement(this);
    };
    this.element = element;
  }

  set active(isActive: boolean) {
    if (isActive) {
      this.element.classList.add("active");
    } else {
      this.element.classList.remove("active");
    }
  }
}

export class Orchestrator {
  private static displayElementsPerPage: number = 100;

  constructor(
    private readonly navBarElement: HTMLElement,
    displayArea: HTMLDivElement,
    displayElements: StampElement[]
  ) {
    let totalPages = Math.ceil(
      displayElements.length / Orchestrator.displayElementsPerPage
    );
    let pageElements: PageElement[] = [];

    let registerActiveElement = (e: PageElement) => {
      pageElements.forEach((f) => (f.active = false));
      e.active = true;
    };
    for (let i = 0; i < totalPages; i++) {
      let beginIndex = Orchestrator.displayElementsPerPage * i;
      let endIndex = beginIndex + Orchestrator.displayElementsPerPage;
      if (endIndex >= displayElements.length) {
        endIndex = displayElements.length;
      }

      pageElements.push(
        new PageElement(
          i + 1,
          displayArea,
          displayElements.slice(beginIndex, endIndex),
          registerActiveElement
        )
      );
    }

    // Create the pagination construct on the navBarElement
    let element = document.createElement("ul");
    element.classList.add("pagination");
    pageElements.forEach((e) => element.appendChild(e.element));

    // Add this complete pagination element to the nav bar
    this.navBarElement.appendChild(element);

    // Once everything is set up, simulate clicking the first element to show
    // the very first set of stamps
    pageElements[0].element.click();
  }
}
