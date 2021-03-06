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

class Pagination {
  private static slidingWindowLength: number = 7;
  private readonly prevMarkerElement: HTMLLIElement | null = null;
  private readonly nextMarkerElement: HTMLLIElement | null = null;
  private currStartIndx: number;
  private numberOfActualSlots: number;

  constructor(
    private readonly slotElements: HTMLLIElement[],
    private readonly parentElement: HTMLUListElement
  ) {
    this.currStartIndx = 0;
    this.numberOfActualSlots = slotElements.length;

    if (slotElements.length > Pagination.slidingWindowLength) {
      // we have more elements than open slots
      // we need to have two more elements called prev and next to accomodate
      // everything now

      // create a previous element
      this.prevMarkerElement = document.createElement("li");
      this.prevMarkerElement.classList.add("page-item");
      this.prevMarkerElement.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    `;

      // create a next element
      this.nextMarkerElement = document.createElement("li");
      this.nextMarkerElement.classList.add("page-item");
      this.nextMarkerElement.innerHTML = `
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    `;

      // -2, since we need to always show the prev and next btns now
      this.numberOfActualSlots = Pagination.slidingWindowLength - 2;
    }

    this.updatePaginationState();
  }

  private updatePaginationState() {
    // cleanup whatever is there currently
    this.parentElement.innerHTML = "";

    if (this.prevMarkerElement != null) {
      this.parentElement.appendChild(this.prevMarkerElement);

      if (this.currStartIndx == 0) {
        // we start at the very beginning so we don't need any previous button
        this.prevMarkerElement.classList.add("disabled");
        this.prevMarkerElement.onclick = null;
      } else {
        // we need the previous button functionality
        this.prevMarkerElement.classList.remove("disabled");
        this.prevMarkerElement.onclick = () => {
          this.currStartIndx -= this.numberOfActualSlots;
          if (this.currStartIndx < 0) {
            // we have exceeded the leftmost bound, adjust accordingly
            this.currStartIndx = 0;
          }
          this.updatePaginationState();
        };
      }
    }

    for (let i = 0; i < this.numberOfActualSlots; i++) {
      this.parentElement.appendChild(this.slotElements[this.currStartIndx + i]);
    }

    if (this.nextMarkerElement != null) {
      this.parentElement.appendChild(this.nextMarkerElement);

      if (
        this.currStartIndx + this.numberOfActualSlots ==
        this.slotElements.length
      ) {
        // we stop at the very end so we don't need any next button
        this.nextMarkerElement.classList.add("disabled");
        this.nextMarkerElement.onclick = null;
      } else {
        // we need the next button functionality
        this.nextMarkerElement.classList.remove("disabled");
        this.nextMarkerElement.onclick = () => {
          this.currStartIndx += this.numberOfActualSlots;

          if (
            this.currStartIndx + this.numberOfActualSlots - 1 >=
            this.slotElements.length
          ) {
            // we have exceeded the rightmost bound, adjust accordingly
            this.currStartIndx =
              this.slotElements.length - this.numberOfActualSlots;
          }

          this.updatePaginationState();
        };
      }
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
    this.navBarElement.appendChild(element);

    let navigationSlots: HTMLLIElement[] = [];
    pageElements.forEach((e) => navigationSlots.push(e.element));

    // create a new pagination object
    new Pagination(navigationSlots, element);

    // Once everything is set up, simulate clicking the first element to show
    // the very first set of stamps
    navigationSlots[0].click();
  }
}
