import {
  StampCardClass,
  StampCardImageClass,
  StampCardNameClass,
  StampElementIDPrefix,
  StampInfoModalID,
} from "./selectors";
import { format } from "./util";

const actualStampImagePath: string =
  "https://cdn.getslowly.com/assets/images/stamp/{0}.png";

const elementInnerHTML: string = `
<img class="card-img-top {0}" src="{1}" alt="{2}"> 
<div class="card-body text-center">
    <span class="card-title {3}">{4}</span>
</div>`;

const modalInnerHTML: string = `
<div class="container">
    <div class="row">
        <div class="col-5 p-0">
            <a href="{0}" target="_blank">
              <img src="{1}">
            </a>
        </div>
        <div class="col-7 p-0">
            <p><b>Description: </b> {2}</p>
            <span class="badge rounded-pill bg-primary">Type: {3}</span>
            <span class="badge rounded-pill bg-warning text-dark">Rarity: {4}</span> 
            <span class="badge rounded-pill bg-info text-dark">Price: {5}</span> 
            <span class="badge rounded-pill bg-info text-dark">Country: {6}</span> 
        </div>
    </div>
</div>`;

export class StampElement {
  private e: HTMLDivElement | null = null;

  constructor(
    readonly id: number,
    private readonly slug: string,
    private readonly name: string,
    private readonly type: string,
    private readonly rarity: string,
    private readonly price: string,
    private readonly description: string,
    private readonly country: string | null,
    private readonly staticAssetsPath: string
  ) {}

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
      format(this.staticAssetsPath, [this.slug]),
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

  get titleForModal(): string {
    return this.name;
  }

  get bodyForModal(): string {
    return format(modalInnerHTML, [
      format(actualStampImagePath, [this.slug]),
      format(this.staticAssetsPath, [this.slug]),
      this.description,
      this.type,
      this.rarity,
      this.price,
      this.country ?? "NA",
    ]);
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
      staticAssetsPath
    );
  }
}
