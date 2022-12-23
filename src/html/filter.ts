import { StampElement } from "./element";

export abstract class Filter {
    abstract get id(): string;
    abstract testValidity(e: StampElement): boolean;
}

export class RarityFilter implements Filter {
    constructor(
        private readonly rarity: string,
    ) { }

    get id(): string {
        return `$rarity-{this.rarity}`;
    }

    testValidity(e: StampElement): boolean {
        return e.rarity === this.rarity;
    }
}

export class PriceFilter implements Filter {
    constructor(
        private readonly price: string,
    ) { }

    get id(): string {
        return `price-${this.price}`;
    }

    testValidity(e: StampElement): boolean {
        return e.price === this.price;
    }
}

export class CountryFilter implements Filter {
    constructor(
        private readonly country: string | null,
    ) { }

    get id(): string {
        return `country-${this.country ?? "NA"}`;
    }

    testValidity(e: StampElement): boolean {
        return e.country === this.country;
    }
}