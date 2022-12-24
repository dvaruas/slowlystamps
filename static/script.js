(()=>{"use strict";class e{constructor(e){this.rarity=e}get id(){return"$rarity-{this.rarity}"}testValidity(e){return e.rarity===this.rarity}}class t{constructor(e){this.price=e}get id(){return`price-${this.price}`}testValidity(e){return e.price===this.price}}class n{constructor(e){this.country=e}get id(){var e;return`country-${null!==(e=this.country)&&void 0!==e?e:"NA"}`}testValidity(e){return e.country===this.country}}const l=["castle-","time-machine"],s="static/braces.svg",i="sw-stamp-",r="sw-modal",a=(e,t)=>e.replace(/{([0-9]+)}/g,(function(e,n){return void 0===t[n]?e:t[n]}));class d{constructor(e,t=null,n=(()=>{}),l=(()=>{})){var s;this.e=e;let i="border",r="border-bottom";e.classList.add("badge","rounded-pill","mx-1",null===(s=null==t?void 0:t())||void 0===s||s?i:r,"border-dark","sw-modal-badge"),e.onclick=()=>{null!=t&&(t()?(l(),e.classList.replace(i,r)):(n(),e.classList.replace(r,i)))}}get element(){return this.e}static createTypeBadge(e){let t=document.createElement("span");return t.classList.add("bg-primary"),t.innerHTML=`Type: ${e}`,new d(t)}static createRarityBadge(t,n){let l=document.createElement("span");l.classList.add("bg-warning","text-dark"),l.innerHTML=`Rarity: ${(e=>{switch(e){case"-1":return"L0";case"1":return"L1";case"2":return"L2";default:return"L3"}})(t)}`;let s=new e(t);return new d(l,(()=>n.hasFilter(s)),(()=>n.addFilter(s)),(()=>n.removeFilter(s)))}static createPriceBadge(e,n){let l=document.createElement("span");l.classList.add("bg-info","text-dark"),l.innerHTML=`Price: ${(e=>{switch(e){case"-1":case"0":return"free";case"1":return"premium";case"2":return"pricey";default:return"unknown"}})(e)}`;let s=new t(e);return new d(l,(()=>n.hasFilter(s)),(()=>n.addFilter(s)),(()=>n.removeFilter(s)))}static createCountryBadgeElement(e,t){let l=document.createElement("span");var s;l.classList.add("bg-info","text-dark","mx-1"),l.innerHTML=`Country: ${s=e,null===s?"NA":s}`;let i=new n(e);return new d(l,(()=>t.hasFilter(i)),(()=>t.addFilter(i)),(()=>t.removeFilter(i)))}}class c{constructor(e,t){this.title=e,this.e=t}static fromStampElement(e,t){let n=document.createElement("img");n.src=e.stampImagePath;let l=document.createElement("a");l.href=a("https://cdn.getslowly.com/assets/images/stamp/{0}.png",[e.slug]),l.target="_blank",l.appendChild(n);let s=document.createElement("div");s.classList.add("col-5","p-0"),s.appendChild(l);let i=document.createElement("p");i.innerHTML=`<b>Description: </b> ${e.description}`;let r=d.createTypeBadge(e.type),h=d.createRarityBadge(e.rarity,t),u=d.createPriceBadge(e.price,t),o=d.createCountryBadgeElement(e.country,t),m=document.createElement("div");m.classList.add("col-7","p-0"),m.appendChild(i),m.appendChild(r.element),m.appendChild(h.element),m.appendChild(u.element),m.appendChild(o.element);let p=document.createElement("div");p.classList.add("row"),p.appendChild(s),p.appendChild(m);let g=document.createElement("div");return g.classList.add("container"),g.appendChild(p),new c(e.name,g)}get titleString(){return this.title}get bodyElement(){return this.e}}class h{constructor(e,t,n,l,s,i,r,a,d){this.id=e,this.slug=t,this.name=n,this.type=l,this.rarity=s,this.price=i,this.description=r,this.country=a,this.stampImagePath=d,this.e=null}get element(){return null!=this.e||(this.e=document.createElement("div"),this.e.id=`${i}${this.id}`,this.e.classList.add("card","text-dark","sw-display-card"),this.e.innerHTML=a('\n<img class="card-img-top {0}" src="{1}" alt="{2}"> \n<div class="card-body text-center">\n    <span class="card-title {3}">{4}</span>\n</div>',["sw-card-img",this.stampImagePath,this.slug,"sw-card-text",this.name]),this.e.setAttribute("data-bs-toggle","modal"),this.e.setAttribute("data-bs-target",`#${r}`)),this.e}static fromJson(e,t){let n=e.id;if(null==n)return null;let s=e.slug;if(null==s)return null;if(l.includes(s))return null;let i=e.name;if(null==i)return null;let r=e.type;if(null==r)return null;let d=e.rarity;if(null==d)return null;let c=e.price;if(null==c)return null;let u=e.desc;if(null==u)return null;let o=e.country;return new h(n,s,i,r,d,c,u,o,a(t,[s]))}}class u{constructor(e,t,n,l){let s=document.createElement("li");s.classList.add("page-item","sw-page-number"),s.innerHTML=`<a class="page-link">${e}</a>`,s.onclick=()=>{t.innerHTML="",n.forEach((e=>{t.appendChild(e.element)})),l(this)},this.element=s}set active(e){e?this.element.classList.add("active"):this.element.classList.remove("active")}}class o{constructor(e,t){this.slotElements=e,this.parentElement=t,this.prevMarkerElement=null,this.nextMarkerElement=null,this.currStartIndx=0,this.numberOfActualSlots=e.length,e.length>o.slidingWindowLength&&(this.prevMarkerElement=document.createElement("li"),this.prevMarkerElement.classList.add("page-item"),this.prevMarkerElement.innerHTML='\n      <a class="page-link" href="#" aria-label="Previous">\n        <span aria-hidden="true">&laquo;</span>\n      </a>\n    ',this.nextMarkerElement=document.createElement("li"),this.nextMarkerElement.classList.add("page-item"),this.nextMarkerElement.innerHTML='\n      <a class="page-link" href="#" aria-label="Next">\n        <span aria-hidden="true">&raquo;</span>\n      </a>\n    ',this.numberOfActualSlots=o.slidingWindowLength-2),this.updatePaginationState()}updatePaginationState(){this.parentElement.innerHTML="",null!=this.prevMarkerElement&&(this.parentElement.appendChild(this.prevMarkerElement),0==this.currStartIndx?(this.prevMarkerElement.classList.add("disabled"),this.prevMarkerElement.onclick=null):(this.prevMarkerElement.classList.remove("disabled"),this.prevMarkerElement.onclick=()=>{this.currStartIndx-=this.numberOfActualSlots,this.currStartIndx<0&&(this.currStartIndx=0),this.updatePaginationState()}));for(let e=0;e<this.numberOfActualSlots;e++)this.parentElement.appendChild(this.slotElements[this.currStartIndx+e]);null!=this.nextMarkerElement&&(this.parentElement.appendChild(this.nextMarkerElement),this.currStartIndx+this.numberOfActualSlots==this.slotElements.length?(this.nextMarkerElement.classList.add("disabled"),this.nextMarkerElement.onclick=null):(this.nextMarkerElement.classList.remove("disabled"),this.nextMarkerElement.onclick=()=>{this.currStartIndx+=this.numberOfActualSlots,this.currStartIndx+this.numberOfActualSlots-1>=this.slotElements.length&&(this.currStartIndx=this.slotElements.length-this.numberOfActualSlots),this.updatePaginationState()}))}}o.slidingWindowLength=7;class m{constructor(e,t){this.o=t,this.lastRemovedFilters=null;let n=document.createElement("img");n.id="sw-filter",n.src=s,n.width=34,n.height=34,n.onclick=()=>{var e;t.hasFilter()?this.lastRemovedFilters=t.removeAllFilters():null===(e=this.lastRemovedFilters)||void 0===e||e.forEach((e=>t.addFilter(e)))},e.appendChild(n),this.filterIndicatorElement=n;let l=document.createElement("p");l.id="sw-count",l.classList.add("h4","px-1"),e.appendChild(l),this.countDisplayerElement=l}update(e){this.countDisplayerElement.innerHTML=`#${e}`,this.filterIndicatorElement.src=this.o.hasFilter()?"static/braces-asterisk.svg":s}}class p{constructor(e,t,n,l){this.displayArea=n,this.displayElements=l,this.filters=new Map,this.stampCounterDisplayer=new m(t,this),this.navigationBlockElement=document.createElement("ul"),this.navigationBlockElement.classList.add("pagination"),e.appendChild(this.navigationBlockElement),this.refresh()}refresh(){let e=[...this.displayElements];for(let[t,n]of this.filters)e=e.filter(n.testValidity,n);let t=Math.ceil(e.length/p.displayElementsPerPage),n=[],l=e=>{n.forEach((e=>e.active=!1)),e.active=!0};for(let s=0;s<t;s++){let t=p.displayElementsPerPage*s,i=t+p.displayElementsPerPage;i>=e.length&&(i=e.length),n.push(new u(s+1,this.displayArea,e.slice(t,i),l))}this.stampCounterDisplayer.update(e.length);let s=[];n.forEach((e=>s.push(e.element))),this.navigationBlockElement.innerHTML="",new o(s,this.navigationBlockElement),s[0].click()}addFilter(e){this.filters.has(e.id)||(this.filters.set(e.id,e),this.refresh())}removeFilter(e){this.filters.delete(e.id)&&this.refresh()}removeAllFilters(){let e=new Map(this.filters);return this.filters.clear(),this.refresh(),e}hasFilter(e=null){return null==e?this.filters.size>0:this.filters.has(e.id)}}p.displayElementsPerPage=100,document.addEventListener("DOMContentLoaded",(function(e){let t,n=document.getElementById("sw-container");if(null==n)return;let l=[],s=new Map,a=document.getElementById(r),d=document.getElementById("sw-modal-title"),u=document.getElementById("sw-modal-body");null!=a&&null!=d&&null!=u&&a.addEventListener("show.bs.modal",(e=>{let n=e.relatedTarget,l=s.get(n.id);if(null!=l){let e=c.fromStampElement(l,t);d.replaceChildren(e.titleString),u.replaceChildren(e.bodyElement)}})),fetch("./static/assets/slowly.json",{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((e=>e.json())).then((e=>{e.items.forEach((e=>{let t=h.fromJson(e,"./static/assets/{0}.webp");null!=t&&(l.push(t),s.set(`${i}${t.id}`,t))})),l.sort(((e,t)=>t.id-e.id));let r=document.getElementById("sw-display-count");if(null==r)return;let a=document.getElementById("sw-navbar");null!=a&&(t=new p(a,r,n,l))}))}))})();