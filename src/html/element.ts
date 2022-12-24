import { CountryFilter, PriceFilter, RarityFilter } from "./filter";
import { slugsToIgnore } from "./ignore";
import { Orchestrator } from "./orchestration";
import {
  StampCardClass,
  StampCardImageClass,
  StampCardNameClass,
  StampElementIDPrefix,
  StampInfoModalBadgeClass,
  StampInfoModalID
} from "./consts";
import { format, formatCountryString, formatPriceString, formatRarityString } from "./util";

const actualStampImagePath: string =
  "https://cdn.getslowly.com/assets/images/stamp/{0}.png";

const elementInnerHTML: string = `
<img class="card-img-top {0}" src="{1}" alt="{2}"> 
<div class="card-body text-center">
    <span class="card-title {3}">{4}</span>
</div>`;

class BadgeElement {
  constructor(
    private readonly e: HTMLSpanElement,
    hasFilter: (() => boolean) | null = null,
    addFilter: () => void = () => { },
    removeFilter: () => void = () => { },
  ) {
    let borderOnFilterPresent = "border";
    let borderOnFilterAbsent = "border-bottom";

    e.classList.add("badge", "rounded-pill", "mx-1",
      (hasFilter?.() ?? true) ? borderOnFilterPresent : borderOnFilterAbsent,
      "border-dark",
      StampInfoModalBadgeClass);

    e.onclick = () => {
      if (hasFilter == null) {
        return;
      }
      if (hasFilter()) {
        // remove the filter
        removeFilter();
        e.classList.replace(borderOnFilterPresent, borderOnFilterAbsent);
      } else {
        // add the filter
        addFilter();
        e.classList.replace(borderOnFilterAbsent, borderOnFilterPresent);
      }
    }
  }

  get element(): HTMLSpanElement {
    return this.e;
  }

  static createTypeBadge(type: string): BadgeElement {
    let e = document.createElement("span");

    e.classList.add("bg-primary");
    e.innerHTML = `Type: ${type}`

    return new BadgeElement(e);
  }

  static createRarityBadge(rarity: string, o: Orchestrator): BadgeElement {
    let e = document.createElement("span");

    e.classList.add("bg-warning", "text-dark");
    e.innerHTML = `Rarity: ${formatRarityString(rarity)}`;

    let rarityFilter = new RarityFilter(rarity);
    return new BadgeElement(e,
      () => o.hasFilter(rarityFilter),
      () => o.addFilter(rarityFilter),
      () => o.removeFilter(rarityFilter));
  }

  static createPriceBadge(price: string, o: Orchestrator): BadgeElement {
    let e = document.createElement("span");

    e.classList.add("bg-info", "text-dark");
    e.innerHTML = `Price: ${formatPriceString(price)}`;

    let priceFilter = new PriceFilter(price);
    return new BadgeElement(e,
      () => o.hasFilter(priceFilter),
      () => o.addFilter(priceFilter),
      () => o.removeFilter(priceFilter));
  }

  static createCountryBadgeElement(country: string | null, o: Orchestrator): BadgeElement {
    let e = document.createElement("span");

    e.classList.add("bg-info", "text-dark", "mx-1");
    e.innerHTML = `Country: ${formatCountryString(country)}`;

    let countryFilter = new CountryFilter(country);
    return new BadgeElement(e,
      () => o.hasFilter(countryFilter),
      () => o.addFilter(countryFilter),
      () => o.removeFilter(countryFilter));
  }
}

export class ModalElement {
  constructor(
    private readonly title: string,
    private readonly e: HTMLDivElement,
  ) { }

  static fromStampElement(
    se: StampElement,
    o: Orchestrator,
  ): ModalElement {
    let imgElem = document.createElement("img");
    imgElem.src = se.stampImagePath;

    let aElement = document.createElement("a")
    aElement.href = format(actualStampImagePath, [se.slug]);
    aElement.target = "_blank";
    aElement.appendChild(imgElem);

    let col1 = document.createElement("div");
    col1.classList.add("col-5", "p-0");
    col1.appendChild(aElement);

    let descriptionTextElem = document.createElement("p");
    descriptionTextElem.innerHTML = `<b>Description: </b> ${se.description}`;

    let typeBadge = BadgeElement.createTypeBadge(se.type);
    let rarityBadge = BadgeElement.createRarityBadge(se.rarity, o);
    let priceBadge = BadgeElement.createPriceBadge(se.price, o);
    let countryBadge = BadgeElement.createCountryBadgeElement(se.country, o);

    let col2 = document.createElement("div");
    col2.classList.add("col-7", "p-0");
    col2.appendChild(descriptionTextElem);
    col2.appendChild(typeBadge.element);
    col2.appendChild(rarityBadge.element);
    col2.appendChild(priceBadge.element);
    col2.appendChild(countryBadge.element);

    let row = document.createElement("div");
    row.classList.add("row");
    row.appendChild(col1);
    row.appendChild(col2);

    let e = document.createElement("div");
    e.classList.add("container");
    e.appendChild(row);

    return new ModalElement(se.name, e);
  }

  get titleString(): string {
    return this.title;
  }

  get bodyElement(): HTMLDivElement {
    return this.e;
  }
}

export class StampElement {
  private e: HTMLDivElement | null = null;

  constructor(
    readonly id: number,
    readonly slug: string,
    readonly name: string,
    readonly type: string,
    readonly rarity: string,
    readonly price: string,
    readonly description: string,
    readonly country: string | null,
    readonly stampImagePath: string
  ) { }

  get element(): HTMLDivElement {
    if (this.e != null) {
      return this.e;
    }

    // Create the element for the first time if not present
    this.e = document.createElement("div");
    this.e.id = `${StampElementIDPrefix}${this.id}`;
    this.e.classList.add("card", "text-dark", StampCardClass);
    this.e.innerHTML = format(elementInnerHTML, [
      StampCardImageClass,
      this.stampImagePath,
      this.slug,
      StampCardNameClass,
      this.name,
    ]);
    // Set up the bootstrap related attributes which would help it to trigger
    // the stamp info modal
    this.e.setAttribute("data-bs-toggle", "modal");
    this.e.setAttribute("data-bs-target", `#${StampInfoModalID}`);
    return this.e;
  }

  static fromJson(
    jsonElem: any,
    staticAssetsPath: string
  ): StampElement | null {
    let id = jsonElem["id"] as number | null;
    if (id == null) {
      return null;
    }

    let slug = jsonElem["slug"] as string | null;
    if (slug == null) {
      return null;
    }
    // Additionally check if the slug is supposed to be ignored
    if (slugsToIgnore.includes(slug)) {
      return null;
    }

    let name = jsonElem["name"] as string | null;
    if (name == null) {
      return null;
    }

    let type = jsonElem["type"] as string | null;
    if (type == null) {
      return null;
    }

    let rarity = jsonElem["rarity"] as string | null;
    if (rarity == null) {
      return null;
    }

    let price = jsonElem["price"] as string | null;
    if (price == null) {
      return null;
    }

    let description = jsonElem["desc"] as string | null;
    if (description == null) {
      return null;
    }

    let country = jsonElem["country"] as string | null;

    return new StampElement(
      id,
      slug,
      name,
      type,
      rarity,
      price,
      description,
      country,
      format(staticAssetsPath, [slug])
    );
  }
}
