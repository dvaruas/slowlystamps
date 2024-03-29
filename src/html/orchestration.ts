import { StampElement } from "./element";
import { Filter } from "./filter";
import {
  FiltersActivatedImageSource,
  FiltersDeactivatedImageSource,
  PageNumberClass,
  StampsFilterClearID,
  TotalStampsParaID,
} from "./consts";

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

class StampCountDisplayer {
  private readonly filterIndicatorElement: HTMLImageElement;
  private readonly countDisplayerElement: HTMLParagraphElement;
  private lastRemovedFilters: Map<String, Filter> | null = null;

  constructor(
    parentElem: HTMLElement,
    private readonly o: Orchestrator,
  ) {
    // Create the filter indicator
    let filterIndicator = document.createElement("img");
    filterIndicator.id = StampsFilterClearID;
    filterIndicator.src = FiltersDeactivatedImageSource;
    filterIndicator.width = 34;
    filterIndicator.height = 34;
    filterIndicator.onclick = () => {
      if (o.hasFilter()) {
        this.lastRemovedFilters = o.removeAllFilters();
      } else {
        this.lastRemovedFilters?.forEach((f) => o.addFilter(f));
      }
    };
    parentElem.appendChild(filterIndicator);
    this.filterIndicatorElement = filterIndicator;

    // Create the number indicator
    let countDisplayer = document.createElement("p");
    countDisplayer.id = TotalStampsParaID;
    countDisplayer.classList.add("h4", "px-1");
    parentElem.appendChild(countDisplayer);
    this.countDisplayerElement = countDisplayer;
  }

  update(count: Number) {
    this.countDisplayerElement.innerHTML = `#${count}`;
    this.filterIndicatorElement.src = this.o.hasFilter() ?
      FiltersActivatedImageSource :
      FiltersDeactivatedImageSource;
  }
}

export class Orchestrator {
  private static displayElementsPerPage: number = 100;

  private readonly navigationBlockElement: HTMLUListElement;
  private readonly stampCounterDisplayer: StampCountDisplayer;
  private readonly filters: Map<string, Filter> = new Map();

  constructor(
    navBarElement: HTMLElement,
    stampCountDisplayerElement: HTMLElement,
    private readonly displayArea: HTMLDivElement,
    private readonly displayElements: StampElement[]
  ) {
    // Create the stamp count displayer.
    this.stampCounterDisplayer = new StampCountDisplayer(
      stampCountDisplayerElement, this);

    // Create the pagination construct on the navBarElement
    this.navigationBlockElement = document.createElement("ul");
    this.navigationBlockElement.classList.add("pagination");
    navBarElement.appendChild(this.navigationBlockElement);

    this.refresh();
  }

  private refresh() {
    let elems = [...this.displayElements];

    // Apply filters to get the elements to show after refresh as per given filters
    for (let [_, f] of this.filters) {
      elems = elems.filter(f.testValidity, f);
    }

    let totalPages = Math.ceil(
      elems.length / Orchestrator.displayElementsPerPage
    );
    let pageElements: PageElement[] = [];

    let registerActiveElement = (e: PageElement) => {
      pageElements.forEach((f) => (f.active = false));
      e.active = true;
    };
    for (let i = 0; i < totalPages; i++) {
      let beginIndex = Orchestrator.displayElementsPerPage * i;
      let endIndex = beginIndex + Orchestrator.displayElementsPerPage;
      if (endIndex >= elems.length) {
        endIndex = elems.length;
      }

      pageElements.push(
        new PageElement(
          i + 1,
          this.displayArea,
          elems.slice(beginIndex, endIndex),
          registerActiveElement
        )
      );
    }

    this.stampCounterDisplayer.update(elems.length);

    let navigationSlots: HTMLLIElement[] = [];
    pageElements.forEach((e) => navigationSlots.push(e.element));

    // Cleanup old navigation block
    this.navigationBlockElement.innerHTML = "";
    // Create a new pagination object
    new Pagination(navigationSlots, this.navigationBlockElement);

    // Once everything is set up, simulate clicking the first element to show
    // the very first set of stamps
    navigationSlots[0].click();
  }

  addFilter(f: Filter) {
    if (this.filters.has(f.id)) {
      return;
    }
    this.filters.set(f.id, f);
    this.refresh();
  }

  removeFilter(f: Filter) {
    if (!this.filters.delete(f.id)) {
      return;
    }
    this.refresh();
  }

  removeAllFilters(): Map<string, Filter> {
    let filtersBkup = new Map(this.filters);
    this.filters.clear();
    this.refresh();
    return filtersBkup;
  }

  hasFilter(f: Filter | null = null): boolean {
    if (f == null) {
      // If no filter is provided, return true if there is atleast one filter set
      return this.filters.size > 0;
    }
    return this.filters.has(f.id);
  }
}
