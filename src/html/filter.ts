import { StampElement } from "./element";

export abstract class Filter {
    abstract get id(): string;
    abstract testValidity(e: StampElement): boolean;
}

export class RarityFilter implements Filter {
    get id(): string {
        throw new Error("Method not implemented.");
    }

    testValidity(e: StampElement): boolean {
        throw new Error("Method not implemented.");
    }
}

export class PriceFilter implements Filter {
    get id(): string {
        throw new Error("Method not implemented.");
    }

    testValidity(e: StampElement): boolean {
        throw new Error("Method not implemented.");
    }
}