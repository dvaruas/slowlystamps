/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/element.ts":
/*!************************!*\
  !*** ./src/element.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StampElement": () => (/* binding */ StampElement)
/* harmony export */ });
/* harmony import */ var _urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./urls */ "./src/urls.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectors */ "./src/selectors.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



const elementInnerHTML = `
<img class="card-img-top {0}" src="{1}" alt="{2}"> 
<div class="card-body text-center">
    <span class="card-title {3}">{4}</span>
</div>`;
const modalInnerHTML = `
<div class="container">
    <div class="row">
        <div class="col-3">
            <img src="{0}" width="200" height="auto">
        </div>
        <div class="col-9">
            <p><b>Description: </b> {1}</p>
            <span class="badge rounded-pill bg-primary">Type: {2}</span>
            <span class="badge rounded-pill bg-warning text-dark">Rarity: {3}</span> 
            <span class="badge rounded-pill bg-info text-dark">Price: {4}</span> 
            <span class="badge rounded-pill bg-info text-dark">Country: {5}</span> 
        </div>
    </div>
</div>`;
class StampElement {
    constructor(id, slug, name, type, itemGroup, rarity, price, description, country) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.type = type;
        this.itemGroup = itemGroup;
        this.rarity = rarity;
        this.price = price;
        this.description = description;
        this.country = country;
        this.e = null;
    }
    get element() {
        if (this.e != null) {
            return this.e;
        }
        // Create the element for the first time if not present
        this.e = document.createElement("div");
        this.e.id = `${_selectors__WEBPACK_IMPORTED_MODULE_1__.StampElementIDPrefix}${this.id}`;
        this.e.classList.add("card", "text-dark", _selectors__WEBPACK_IMPORTED_MODULE_1__.StampCardClass);
        this.e.innerHTML = (0,_util__WEBPACK_IMPORTED_MODULE_2__.format)(elementInnerHTML, [
            _selectors__WEBPACK_IMPORTED_MODULE_1__.StampCardImageClass,
            (0,_util__WEBPACK_IMPORTED_MODULE_2__.format)(_urls__WEBPACK_IMPORTED_MODULE_0__.fetchImageURL, [this.slug]),
            this.slug,
            _selectors__WEBPACK_IMPORTED_MODULE_1__.StampCardNameClass,
            this.name,
        ]);
        // Set up the bootstrap related attributes which would help it to trigger
        // the stamp info modal
        this.e.setAttribute("data-bs-toggle", "modal");
        this.e.setAttribute("data-bs-target", `#${_selectors__WEBPACK_IMPORTED_MODULE_1__.StampInfoModalID}`);
        return this.e;
    }
    get titleForModal() {
        return this.name;
    }
    get bodyForModal() {
        var _a;
        return (0,_util__WEBPACK_IMPORTED_MODULE_2__.format)(modalInnerHTML, [
            (0,_util__WEBPACK_IMPORTED_MODULE_2__.format)(_urls__WEBPACK_IMPORTED_MODULE_0__.fetchImageURL, [this.slug]),
            this.description,
            this.type,
            this.rarity,
            this.price,
            (_a = this.country) !== null && _a !== void 0 ? _a : "NA",
        ]);
    }
    static fromJson(jsonElem) {
        let id = jsonElem["id"];
        if (id == null) {
            return null;
        }
        let slug = jsonElem["slug"];
        if (slug == null) {
            return null;
        }
        let name = jsonElem["name"];
        if (name == null) {
            return null;
        }
        let type = jsonElem["type"];
        if (type == null) {
            return null;
        }
        let itemGroup = jsonElem["item_group"];
        if (itemGroup == null) {
            return null;
        }
        let rarity = jsonElem["rarity"];
        if (rarity == null) {
            return null;
        }
        let price = jsonElem["price"];
        if (price == null) {
            return null;
        }
        let description = jsonElem["desc"];
        if (description == null) {
            return null;
        }
        let country = jsonElem["country"];
        return new StampElement(id, slug, name, type, itemGroup, rarity, price, description, country);
    }
}


/***/ }),

/***/ "./src/orchestration.ts":
/*!******************************!*\
  !*** ./src/orchestration.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Orchestrator": () => (/* binding */ Orchestrator)
/* harmony export */ });
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectors */ "./src/selectors.ts");

class PageElement {
    constructor(pageNumber, displayArea, displayElements, registerActiveElement) {
        // Create the pagination element
        let element = document.createElement("li");
        element.classList.add("page-item", _selectors__WEBPACK_IMPORTED_MODULE_0__.PageNumberClass);
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
    set active(isActive) {
        if (isActive) {
            this.element.classList.add("active");
        }
        else {
            this.element.classList.remove("active");
        }
    }
}
class Orchestrator {
    constructor(navBarElement, displayArea, displayElements) {
        this.navBarElement = navBarElement;
        let totalPages = Math.ceil(displayElements.length / Orchestrator.displayElementsPerPage);
        let pageElements = [];
        let registerActiveElement = (e) => {
            pageElements.forEach((f) => (f.active = false));
            e.active = true;
        };
        for (let i = 0; i < totalPages; i++) {
            let beginIndex = Orchestrator.displayElementsPerPage * i;
            let endIndex = beginIndex + Orchestrator.displayElementsPerPage;
            if (endIndex >= displayElements.length) {
                endIndex = displayElements.length;
            }
            pageElements.push(new PageElement(i + 1, displayArea, displayElements.slice(beginIndex, endIndex), registerActiveElement));
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
Orchestrator.displayElementsPerPage = 100;


/***/ }),

/***/ "./src/selectors.ts":
/*!**************************!*\
  !*** ./src/selectors.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NavigationBarID": () => (/* binding */ NavigationBarID),
/* harmony export */   "PageNumberClass": () => (/* binding */ PageNumberClass),
/* harmony export */   "StampCardClass": () => (/* binding */ StampCardClass),
/* harmony export */   "StampCardImageClass": () => (/* binding */ StampCardImageClass),
/* harmony export */   "StampCardNameClass": () => (/* binding */ StampCardNameClass),
/* harmony export */   "StampElementIDPrefix": () => (/* binding */ StampElementIDPrefix),
/* harmony export */   "StampInfoModalBodyID": () => (/* binding */ StampInfoModalBodyID),
/* harmony export */   "StampInfoModalID": () => (/* binding */ StampInfoModalID),
/* harmony export */   "StampInfoModalTitleID": () => (/* binding */ StampInfoModalTitleID),
/* harmony export */   "StampsContainerID": () => (/* binding */ StampsContainerID),
/* harmony export */   "TotalStampsCountID": () => (/* binding */ TotalStampsCountID)
/* harmony export */ });
// The container containing all the stamps to be shown
const StampsContainerID = "sw-container";
// The navigation bar element
const NavigationBarID = "sw-navbar";
// The numbers in the pagination (inside navigation bar)
const PageNumberClass = "sw-page-number";
// Element inside which the total number of stamps count is shown
const TotalStampsCountID = "sw-count";
// Each stamp element ID prefix
const StampElementIDPrefix = "sw-stamp-";
// A card showing the stamp
const StampCardClass = "sw-display-card";
const StampCardImageClass = "sw-card-img";
const StampCardNameClass = "sw-card-text";
// Common modal for the stamps info display
const StampInfoModalID = "sw-modal";
const StampInfoModalTitleID = "sw-modal-title";
const StampInfoModalBodyID = "sw-modal-body";


/***/ }),

/***/ "./src/urls.ts":
/*!*********************!*\
  !*** ./src/urls.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchImageURL": () => (/* binding */ fetchImageURL),
/* harmony export */   "fetchInfoURL": () => (/* binding */ fetchInfoURL)
/* harmony export */ });
const fetchInfoURL = "https://api.getslowly.com/slowly";
const fetchImageURL = "https://cdn.getslowly.com/assets/images/stamp/{0}.png";


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "format": () => (/* binding */ format)
/* harmony export */ });
const format = (s, args) => {
    // store arguments in an array
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return s.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == "undefined" ? match : args[index];
    });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./urls */ "./src/urls.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element */ "./src/element.ts");
/* harmony import */ var _orchestration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./orchestration */ "./src/orchestration.ts");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectors */ "./src/selectors.ts");




document.addEventListener("DOMContentLoaded", function (_) {
    let containerElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.StampsContainerID);
    if (containerElem == null) {
        return;
    }
    // Data structures holding information for all the stamps
    let stampList = [];
    let stampMap = new Map();
    // Setup the modal, what happens when a stamp is clicked on
    let stampInfoModalElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.StampInfoModalID);
    let stampInfoModalTitleElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.StampInfoModalTitleID);
    let stampInfoModalBodyElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.StampInfoModalBodyID);
    if (stampInfoModalElem != null &&
        stampInfoModalTitleElem != null &&
        stampInfoModalBodyElem != null) {
        stampInfoModalElem.addEventListener("show.bs.modal", (e) => {
            let elem = e.relatedTarget;
            let stampElem = stampMap.get(elem.id);
            if (stampElem != null) {
                stampInfoModalTitleElem.innerHTML = stampElem.titleForModal;
                stampInfoModalBodyElem.innerHTML = stampElem.bodyForModal;
            }
        });
    }
    // Fetch the actual data from the Slowly API
    fetch(_urls__WEBPACK_IMPORTED_MODULE_0__.fetchInfoURL)
        .then(function (response) {
        return response.json();
    })
        .then(function (myJson) {
        let stampItems = myJson["items"];
        stampItems.forEach((e) => {
            let elem = _element__WEBPACK_IMPORTED_MODULE_1__.StampElement.fromJson(e);
            if (elem != null) {
                stampList.push(elem);
                stampMap.set(`${_selectors__WEBPACK_IMPORTED_MODULE_3__.StampElementIDPrefix}${elem.id}`, elem);
            }
        });
        // Sort the items in the list, in descending order to the ID value. This
        // ensures that the items which were added the latest would be available
        // at the beginning
        stampList.sort((a, b) => b.id - a.id);
        // Put the total count number in the navigation bar
        let stampsCountElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.TotalStampsCountID);
        if (stampsCountElem != null) {
            stampsCountElem.innerHTML = `#${stampItems.length}`;
        }
        // Create the Orchestrator for these stamps
        let navBarElem = document.getElementById(_selectors__WEBPACK_IMPORTED_MODULE_3__.NavigationBarID);
        if (navBarElem == null) {
            return;
        }
        new _orchestration__WEBPACK_IMPORTED_MODULE_2__.Orchestrator(navBarElem, containerElem, stampList);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RXRDLG1EQUFtRDtRQUNuRCxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLDBEQUFrQixDQUFDLENBQUM7UUFDbEUsSUFBSSxlQUFlLElBQUksSUFBSSxFQUFFO1lBQzNCLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckQ7UUFFRCwyQ0FBMkM7UUFDM0MsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyx1REFBZSxDQUFDLENBQUM7UUFDMUQsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUNELElBQUksd0RBQVksQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbG93bHlzdGFtcHMvLi9zcmMvZWxlbWVudC50cyIsIndlYnBhY2s6Ly9zbG93bHlzdGFtcHMvLi9zcmMvb3JjaGVzdHJhdGlvbi50cyIsIndlYnBhY2s6Ly9zbG93bHlzdGFtcHMvLi9zcmMvc2VsZWN0b3JzLnRzIiwid2VicGFjazovL3Nsb3dseXN0YW1wcy8uL3NyYy91cmxzLnRzIiwid2VicGFjazovL3Nsb3dseXN0YW1wcy8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL3Nsb3dseXN0YW1wcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zbG93bHlzdGFtcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Nsb3dseXN0YW1wcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Nsb3dseXN0YW1wcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nsb3dseXN0YW1wcy8uL3NyYy9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmV0Y2hJbWFnZVVSTCB9IGZyb20gXCIuL3VybHNcIjtcbmltcG9ydCB7XG4gIFN0YW1wQ2FyZENsYXNzLFxuICBTdGFtcENhcmRJbWFnZUNsYXNzLFxuICBTdGFtcENhcmROYW1lQ2xhc3MsXG4gIFN0YW1wRWxlbWVudElEUHJlZml4LFxuICBTdGFtcEluZm9Nb2RhbElELFxufSBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gXCIuL3V0aWxcIjtcblxuY29uc3QgZWxlbWVudElubmVySFRNTDogc3RyaW5nID0gYFxuPGltZyBjbGFzcz1cImNhcmQtaW1nLXRvcCB7MH1cIiBzcmM9XCJ7MX1cIiBhbHQ9XCJ7Mn1cIj4gXG48ZGl2IGNsYXNzPVwiY2FyZC1ib2R5IHRleHQtY2VudGVyXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjYXJkLXRpdGxlIHszfVwiPns0fTwvc3Bhbj5cbjwvZGl2PmA7XG5cbmNvbnN0IG1vZGFsSW5uZXJIVE1MOiBzdHJpbmcgPSBgXG48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTNcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiezB9XCIgd2lkdGg9XCIyMDBcIiBoZWlnaHQ9XCJhdXRvXCI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTlcIj5cbiAgICAgICAgICAgIDxwPjxiPkRlc2NyaXB0aW9uOiA8L2I+IHsxfTwvcD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2Ugcm91bmRlZC1waWxsIGJnLXByaW1hcnlcIj5UeXBlOiB7Mn08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIHJvdW5kZWQtcGlsbCBiZy13YXJuaW5nIHRleHQtZGFya1wiPlJhcml0eTogezN9PC9zcGFuPiBcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2Ugcm91bmRlZC1waWxsIGJnLWluZm8gdGV4dC1kYXJrXCI+UHJpY2U6IHs0fTwvc3Bhbj4gXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIHJvdW5kZWQtcGlsbCBiZy1pbmZvIHRleHQtZGFya1wiPkNvdW50cnk6IHs1fTwvc3Bhbj4gXG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+YDtcblxuZXhwb3J0IGNsYXNzIFN0YW1wRWxlbWVudCB7XG4gIHByaXZhdGUgZTogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBpZDogbnVtYmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2x1Zzogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdHlwZTogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbUdyb3VwOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSByYXJpdHk6IHN0cmluZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByaWNlOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY291bnRyeTogc3RyaW5nIHwgbnVsbFxuICApIHt9XG5cbiAgZ2V0IGVsZW1lbnQoKTogSFRNTERpdkVsZW1lbnQge1xuICAgIGlmICh0aGlzLmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIGVsZW1lbnQgZm9yIHRoZSBmaXJzdCB0aW1lIGlmIG5vdCBwcmVzZW50XG4gICAgdGhpcy5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmUuaWQgPSBgJHtTdGFtcEVsZW1lbnRJRFByZWZpeH0ke3RoaXMuaWR9YDtcbiAgICB0aGlzLmUuY2xhc3NMaXN0LmFkZChcImNhcmRcIiwgXCJ0ZXh0LWRhcmtcIiwgU3RhbXBDYXJkQ2xhc3MpO1xuICAgIHRoaXMuZS5pbm5lckhUTUwgPSBmb3JtYXQoZWxlbWVudElubmVySFRNTCwgW1xuICAgICAgU3RhbXBDYXJkSW1hZ2VDbGFzcyxcbiAgICAgIGZvcm1hdChmZXRjaEltYWdlVVJMLCBbdGhpcy5zbHVnXSksXG4gICAgICB0aGlzLnNsdWcsXG4gICAgICBTdGFtcENhcmROYW1lQ2xhc3MsXG4gICAgICB0aGlzLm5hbWUsXG4gICAgXSk7XG4gICAgLy8gU2V0IHVwIHRoZSBib290c3RyYXAgcmVsYXRlZCBhdHRyaWJ1dGVzIHdoaWNoIHdvdWxkIGhlbHAgaXQgdG8gdHJpZ2dlclxuICAgIC8vIHRoZSBzdGFtcCBpbmZvIG1vZGFsXG4gICAgdGhpcy5lLnNldEF0dHJpYnV0ZShcImRhdGEtYnMtdG9nZ2xlXCIsIFwibW9kYWxcIik7XG4gICAgdGhpcy5lLnNldEF0dHJpYnV0ZShcImRhdGEtYnMtdGFyZ2V0XCIsIGAjJHtTdGFtcEluZm9Nb2RhbElEfWApO1xuICAgIHJldHVybiB0aGlzLmU7XG4gIH1cblxuICBnZXQgdGl0bGVGb3JNb2RhbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBnZXQgYm9keUZvck1vZGFsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZvcm1hdChtb2RhbElubmVySFRNTCwgW1xuICAgICAgZm9ybWF0KGZldGNoSW1hZ2VVUkwsIFt0aGlzLnNsdWddKSxcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICB0aGlzLnR5cGUsXG4gICAgICB0aGlzLnJhcml0eSxcbiAgICAgIHRoaXMucHJpY2UsXG4gICAgICB0aGlzLmNvdW50cnkgPz8gXCJOQVwiLFxuICAgIF0pO1xuICB9XG5cbiAgc3RhdGljIGZyb21Kc29uKGpzb25FbGVtOiBhbnkpOiBTdGFtcEVsZW1lbnQgfCBudWxsIHtcbiAgICBsZXQgaWQgPSBqc29uRWxlbVtcImlkXCJdIGFzIG51bWJlciB8IG51bGw7XG4gICAgaWYgKGlkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgc2x1ZyA9IGpzb25FbGVtW1wic2x1Z1wiXSBhcyBzdHJpbmcgfCBudWxsO1xuICAgIGlmIChzbHVnID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgbmFtZSA9IGpzb25FbGVtW1wibmFtZVwiXSBhcyBzdHJpbmcgfCBudWxsO1xuICAgIGlmIChuYW1lID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgdHlwZSA9IGpzb25FbGVtW1widHlwZVwiXSBhcyBzdHJpbmcgfCBudWxsO1xuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgaXRlbUdyb3VwID0ganNvbkVsZW1bXCJpdGVtX2dyb3VwXCJdIGFzIHN0cmluZyB8IG51bGw7XG4gICAgaWYgKGl0ZW1Hcm91cCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IHJhcml0eSA9IGpzb25FbGVtW1wicmFyaXR5XCJdIGFzIHN0cmluZyB8IG51bGw7XG4gICAgaWYgKHJhcml0eSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IHByaWNlID0ganNvbkVsZW1bXCJwcmljZVwiXSBhcyBzdHJpbmcgfCBudWxsO1xuICAgIGlmIChwcmljZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IGRlc2NyaXB0aW9uID0ganNvbkVsZW1bXCJkZXNjXCJdIGFzIHN0cmluZyB8IG51bGw7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgY291bnRyeSA9IGpzb25FbGVtW1wiY291bnRyeVwiXSBhcyBzdHJpbmcgfCBudWxsO1xuXG4gICAgcmV0dXJuIG5ldyBTdGFtcEVsZW1lbnQoXG4gICAgICBpZCxcbiAgICAgIHNsdWcsXG4gICAgICBuYW1lLFxuICAgICAgdHlwZSxcbiAgICAgIGl0ZW1Hcm91cCxcbiAgICAgIHJhcml0eSxcbiAgICAgIHByaWNlLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBjb3VudHJ5XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3RhbXBFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudFwiO1xuaW1wb3J0IHsgUGFnZU51bWJlckNsYXNzIH0gZnJvbSBcIi4vc2VsZWN0b3JzXCI7XG5cbmNsYXNzIFBhZ2VFbGVtZW50IHtcbiAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxMSUVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFnZU51bWJlcjogbnVtYmVyLFxuICAgIGRpc3BsYXlBcmVhOiBIVE1MRGl2RWxlbWVudCxcbiAgICBkaXNwbGF5RWxlbWVudHM6IFN0YW1wRWxlbWVudFtdLFxuICAgIHJlZ2lzdGVyQWN0aXZlRWxlbWVudDogKGU6IFBhZ2VFbGVtZW50KSA9PiB2b2lkXG4gICkge1xuICAgIC8vIENyZWF0ZSB0aGUgcGFnaW5hdGlvbiBlbGVtZW50XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwicGFnZS1pdGVtXCIsIFBhZ2VOdW1iZXJDbGFzcyk7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBgPGEgY2xhc3M9XCJwYWdlLWxpbmtcIj4ke3BhZ2VOdW1iZXJ9PC9hPmA7XG4gICAgZWxlbWVudC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgZGlzcGxheUFyZWEuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIGRpc3BsYXlFbGVtZW50cy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgIGRpc3BsYXlBcmVhLmFwcGVuZENoaWxkKGVsZW0uZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICAgIHJlZ2lzdGVyQWN0aXZlRWxlbWVudCh0aGlzKTtcbiAgICB9O1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cblxuICBzZXQgYWN0aXZlKGlzQWN0aXZlOiBib29sZWFuKSB7XG4gICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPcmNoZXN0cmF0b3Ige1xuICBwcml2YXRlIHN0YXRpYyBkaXNwbGF5RWxlbWVudHNQZXJQYWdlOiBudW1iZXIgPSAxMDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBuYXZCYXJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBkaXNwbGF5QXJlYTogSFRNTERpdkVsZW1lbnQsXG4gICAgZGlzcGxheUVsZW1lbnRzOiBTdGFtcEVsZW1lbnRbXVxuICApIHtcbiAgICBsZXQgdG90YWxQYWdlcyA9IE1hdGguY2VpbChcbiAgICAgIGRpc3BsYXlFbGVtZW50cy5sZW5ndGggLyBPcmNoZXN0cmF0b3IuZGlzcGxheUVsZW1lbnRzUGVyUGFnZVxuICAgICk7XG4gICAgbGV0IHBhZ2VFbGVtZW50czogUGFnZUVsZW1lbnRbXSA9IFtdO1xuXG4gICAgbGV0IHJlZ2lzdGVyQWN0aXZlRWxlbWVudCA9IChlOiBQYWdlRWxlbWVudCkgPT4ge1xuICAgICAgcGFnZUVsZW1lbnRzLmZvckVhY2goKGYpID0+IChmLmFjdGl2ZSA9IGZhbHNlKSk7XG4gICAgICBlLmFjdGl2ZSA9IHRydWU7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgbGV0IGJlZ2luSW5kZXggPSBPcmNoZXN0cmF0b3IuZGlzcGxheUVsZW1lbnRzUGVyUGFnZSAqIGk7XG4gICAgICBsZXQgZW5kSW5kZXggPSBiZWdpbkluZGV4ICsgT3JjaGVzdHJhdG9yLmRpc3BsYXlFbGVtZW50c1BlclBhZ2U7XG4gICAgICBpZiAoZW5kSW5kZXggPj0gZGlzcGxheUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBlbmRJbmRleCA9IGRpc3BsYXlFbGVtZW50cy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHBhZ2VFbGVtZW50cy5wdXNoKFxuICAgICAgICBuZXcgUGFnZUVsZW1lbnQoXG4gICAgICAgICAgaSArIDEsXG4gICAgICAgICAgZGlzcGxheUFyZWEsXG4gICAgICAgICAgZGlzcGxheUVsZW1lbnRzLnNsaWNlKGJlZ2luSW5kZXgsIGVuZEluZGV4KSxcbiAgICAgICAgICByZWdpc3RlckFjdGl2ZUVsZW1lbnRcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIHBhZ2luYXRpb24gY29uc3RydWN0IG9uIHRoZSBuYXZCYXJFbGVtZW50XG4gICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwicGFnaW5hdGlvblwiKTtcbiAgICBwYWdlRWxlbWVudHMuZm9yRWFjaCgoZSkgPT4gZWxlbWVudC5hcHBlbmRDaGlsZChlLmVsZW1lbnQpKTtcblxuICAgIC8vIEFkZCB0aGlzIGNvbXBsZXRlIHBhZ2luYXRpb24gZWxlbWVudCB0byB0aGUgbmF2IGJhclxuICAgIHRoaXMubmF2QmFyRWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuICAgIC8vIE9uY2UgZXZlcnl0aGluZyBpcyBzZXQgdXAsIHNpbXVsYXRlIGNsaWNraW5nIHRoZSBmaXJzdCBlbGVtZW50IHRvIHNob3dcbiAgICAvLyB0aGUgdmVyeSBmaXJzdCBzZXQgb2Ygc3RhbXBzXG4gICAgcGFnZUVsZW1lbnRzWzBdLmVsZW1lbnQuY2xpY2soKTtcbiAgfVxufVxuIiwiLy8gVGhlIGNvbnRhaW5lciBjb250YWluaW5nIGFsbCB0aGUgc3RhbXBzIHRvIGJlIHNob3duXG5leHBvcnQgY29uc3QgU3RhbXBzQ29udGFpbmVySUQgPSBcInN3LWNvbnRhaW5lclwiO1xuXG4vLyBUaGUgbmF2aWdhdGlvbiBiYXIgZWxlbWVudFxuZXhwb3J0IGNvbnN0IE5hdmlnYXRpb25CYXJJRCA9IFwic3ctbmF2YmFyXCI7XG5cbi8vIFRoZSBudW1iZXJzIGluIHRoZSBwYWdpbmF0aW9uIChpbnNpZGUgbmF2aWdhdGlvbiBiYXIpXG5leHBvcnQgY29uc3QgUGFnZU51bWJlckNsYXNzID0gXCJzdy1wYWdlLW51bWJlclwiO1xuXG4vLyBFbGVtZW50IGluc2lkZSB3aGljaCB0aGUgdG90YWwgbnVtYmVyIG9mIHN0YW1wcyBjb3VudCBpcyBzaG93blxuZXhwb3J0IGNvbnN0IFRvdGFsU3RhbXBzQ291bnRJRCA9IFwic3ctY291bnRcIjtcblxuLy8gRWFjaCBzdGFtcCBlbGVtZW50IElEIHByZWZpeFxuZXhwb3J0IGNvbnN0IFN0YW1wRWxlbWVudElEUHJlZml4ID0gXCJzdy1zdGFtcC1cIjtcblxuLy8gQSBjYXJkIHNob3dpbmcgdGhlIHN0YW1wXG5leHBvcnQgY29uc3QgU3RhbXBDYXJkQ2xhc3MgPSBcInN3LWRpc3BsYXktY2FyZFwiO1xuZXhwb3J0IGNvbnN0IFN0YW1wQ2FyZEltYWdlQ2xhc3MgPSBcInN3LWNhcmQtaW1nXCI7XG5leHBvcnQgY29uc3QgU3RhbXBDYXJkTmFtZUNsYXNzID0gXCJzdy1jYXJkLXRleHRcIjtcblxuLy8gQ29tbW9uIG1vZGFsIGZvciB0aGUgc3RhbXBzIGluZm8gZGlzcGxheVxuZXhwb3J0IGNvbnN0IFN0YW1wSW5mb01vZGFsSUQgPSBcInN3LW1vZGFsXCI7XG5leHBvcnQgY29uc3QgU3RhbXBJbmZvTW9kYWxUaXRsZUlEID0gXCJzdy1tb2RhbC10aXRsZVwiO1xuZXhwb3J0IGNvbnN0IFN0YW1wSW5mb01vZGFsQm9keUlEID0gXCJzdy1tb2RhbC1ib2R5XCI7XG4iLCJleHBvcnQgY29uc3QgZmV0Y2hJbmZvVVJMOiBzdHJpbmcgPSBcImh0dHBzOi8vYXBpLmdldHNsb3dseS5jb20vc2xvd2x5XCI7XG5cbmV4cG9ydCBjb25zdCBmZXRjaEltYWdlVVJMOiBzdHJpbmcgPVxuICBcImh0dHBzOi8vY2RuLmdldHNsb3dseS5jb20vYXNzZXRzL2ltYWdlcy9zdGFtcC97MH0ucG5nXCI7XG4iLCJleHBvcnQgY29uc3QgZm9ybWF0OiAoczogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkgPT4gc3RyaW5nID0gKHMsIGFyZ3MpID0+IHtcbiAgLy8gc3RvcmUgYXJndW1lbnRzIGluIGFuIGFycmF5XG4gIC8vIHVzZSByZXBsYWNlIHRvIGl0ZXJhdGUgb3ZlciB0aGUgc3RyaW5nXG4gIC8vIHNlbGVjdCB0aGUgbWF0Y2ggYW5kIGNoZWNrIGlmIHJlbGF0ZWQgYXJndW1lbnQgaXMgcHJlc2VudFxuICAvLyBpZiB5ZXMsIHJlcGxhY2UgdGhlIG1hdGNoIHdpdGggdGhlIGFyZ3VtZW50XG4gIHJldHVybiBzLnJlcGxhY2UoL3soWzAtOV0rKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCkge1xuICAgIC8vIGNoZWNrIGlmIHRoZSBhcmd1bWVudCBpcyBwcmVzZW50XG4gICAgcmV0dXJuIHR5cGVvZiBhcmdzW2luZGV4XSA9PSBcInVuZGVmaW5lZFwiID8gbWF0Y2ggOiBhcmdzW2luZGV4XTtcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmZXRjaEluZm9VUkwgfSBmcm9tIFwiLi91cmxzXCI7XG5pbXBvcnQgeyBTdGFtcEVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50XCI7XG5pbXBvcnQgeyBPcmNoZXN0cmF0b3IgfSBmcm9tIFwiLi9vcmNoZXN0cmF0aW9uXCI7XG5pbXBvcnQge1xuICBOYXZpZ2F0aW9uQmFySUQsXG4gIFN0YW1wRWxlbWVudElEUHJlZml4LFxuICBTdGFtcEluZm9Nb2RhbEJvZHlJRCxcbiAgU3RhbXBJbmZvTW9kYWxJRCxcbiAgU3RhbXBJbmZvTW9kYWxUaXRsZUlELFxuICBTdGFtcHNDb250YWluZXJJRCxcbiAgVG90YWxTdGFtcHNDb3VudElELFxufSBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKF8pIHtcbiAgbGV0IGNvbnRhaW5lckVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBTdGFtcHNDb250YWluZXJJRFxuICApIGFzIEhUTUxEaXZFbGVtZW50O1xuICBpZiAoY29udGFpbmVyRWxlbSA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGF0YSBzdHJ1Y3R1cmVzIGhvbGRpbmcgaW5mb3JtYXRpb24gZm9yIGFsbCB0aGUgc3RhbXBzXG4gIGxldCBzdGFtcExpc3Q6IFN0YW1wRWxlbWVudFtdID0gW107XG4gIGxldCBzdGFtcE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBTdGFtcEVsZW1lbnQ+KCk7XG5cbiAgLy8gU2V0dXAgdGhlIG1vZGFsLCB3aGF0IGhhcHBlbnMgd2hlbiBhIHN0YW1wIGlzIGNsaWNrZWQgb25cbiAgbGV0IHN0YW1wSW5mb01vZGFsRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFN0YW1wSW5mb01vZGFsSURcbiAgKSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgbGV0IHN0YW1wSW5mb01vZGFsVGl0bGVFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgU3RhbXBJbmZvTW9kYWxUaXRsZUlEXG4gICkgYXMgSFRNTEVsZW1lbnQ7XG4gIGxldCBzdGFtcEluZm9Nb2RhbEJvZHlFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgU3RhbXBJbmZvTW9kYWxCb2R5SURcbiAgKSBhcyBIVE1MRWxlbWVudDtcbiAgaWYgKFxuICAgIHN0YW1wSW5mb01vZGFsRWxlbSAhPSBudWxsICYmXG4gICAgc3RhbXBJbmZvTW9kYWxUaXRsZUVsZW0gIT0gbnVsbCAmJlxuICAgIHN0YW1wSW5mb01vZGFsQm9keUVsZW0gIT0gbnVsbFxuICApIHtcbiAgICBzdGFtcEluZm9Nb2RhbEVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcInNob3cuYnMubW9kYWxcIiwgKGU6IEV2ZW50KSA9PiB7XG4gICAgICBsZXQgZWxlbSA9IChlIGFzIE1vdXNlRXZlbnQpLnJlbGF0ZWRUYXJnZXQgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICBsZXQgc3RhbXBFbGVtID0gc3RhbXBNYXAuZ2V0KGVsZW0uaWQpO1xuICAgICAgaWYgKHN0YW1wRWxlbSAhPSBudWxsKSB7XG4gICAgICAgIHN0YW1wSW5mb01vZGFsVGl0bGVFbGVtLmlubmVySFRNTCA9IHN0YW1wRWxlbS50aXRsZUZvck1vZGFsO1xuICAgICAgICBzdGFtcEluZm9Nb2RhbEJvZHlFbGVtLmlubmVySFRNTCA9IHN0YW1wRWxlbS5ib2R5Rm9yTW9kYWw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBGZXRjaCB0aGUgYWN0dWFsIGRhdGEgZnJvbSB0aGUgU2xvd2x5IEFQSVxuICBmZXRjaChmZXRjaEluZm9VUkwpXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKG15SnNvbjogYW55KSB7XG4gICAgICBsZXQgc3RhbXBJdGVtcyA9IG15SnNvbltcIml0ZW1zXCJdO1xuICAgICAgc3RhbXBJdGVtcy5mb3JFYWNoKChlOiBhbnkpID0+IHtcbiAgICAgICAgbGV0IGVsZW0gPSBTdGFtcEVsZW1lbnQuZnJvbUpzb24oZSk7XG4gICAgICAgIGlmIChlbGVtICE9IG51bGwpIHtcbiAgICAgICAgICBzdGFtcExpc3QucHVzaChlbGVtKTtcbiAgICAgICAgICBzdGFtcE1hcC5zZXQoYCR7U3RhbXBFbGVtZW50SURQcmVmaXh9JHtlbGVtLmlkfWAsIGVsZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gU29ydCB0aGUgaXRlbXMgaW4gdGhlIGxpc3QsIGluIGRlc2NlbmRpbmcgb3JkZXIgdG8gdGhlIElEIHZhbHVlLiBUaGlzXG4gICAgICAvLyBlbnN1cmVzIHRoYXQgdGhlIGl0ZW1zIHdoaWNoIHdlcmUgYWRkZWQgdGhlIGxhdGVzdCB3b3VsZCBiZSBhdmFpbGFibGVcbiAgICAgIC8vIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgIHN0YW1wTGlzdC5zb3J0KChhLCBiKSA9PiBiLmlkIC0gYS5pZCk7XG5cbiAgICAgIC8vIFB1dCB0aGUgdG90YWwgY291bnQgbnVtYmVyIGluIHRoZSBuYXZpZ2F0aW9uIGJhclxuICAgICAgbGV0IHN0YW1wc0NvdW50RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFRvdGFsU3RhbXBzQ291bnRJRCk7XG4gICAgICBpZiAoc3RhbXBzQ291bnRFbGVtICE9IG51bGwpIHtcbiAgICAgICAgc3RhbXBzQ291bnRFbGVtLmlubmVySFRNTCA9IGAjJHtzdGFtcEl0ZW1zLmxlbmd0aH1gO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgdGhlIE9yY2hlc3RyYXRvciBmb3IgdGhlc2Ugc3RhbXBzXG4gICAgICBsZXQgbmF2QmFyRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKE5hdmlnYXRpb25CYXJJRCk7XG4gICAgICBpZiAobmF2QmFyRWxlbSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5ldyBPcmNoZXN0cmF0b3IobmF2QmFyRWxlbSwgY29udGFpbmVyRWxlbSwgc3RhbXBMaXN0KTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9