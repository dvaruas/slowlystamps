import { StampElement } from "./element";
import { Orchestrator } from "./orchestration";
import {
  NavigationBarID,
  StampElementIDPrefix,
  StampInfoModalBodyID,
  StampInfoModalID,
  StampInfoModalTitleID,
  StampsContainerID,
  TotalStampsCountID,
} from "./selectors";

document.addEventListener("DOMContentLoaded", function (_) {
  let containerElem = document.getElementById(
    StampsContainerID
  ) as HTMLDivElement;
  if (containerElem == null) {
    return;
  }

  // Data structures holding information for all the stamps
  let stampList: StampElement[] = [];
  let stampMap = new Map<string, StampElement>();

  // Setup the modal, what happens when a stamp is clicked on
  let stampInfoModalElem = document.getElementById(
    StampInfoModalID
  ) as HTMLDivElement;
  let stampInfoModalTitleElem = document.getElementById(
    StampInfoModalTitleID
  ) as HTMLElement;
  let stampInfoModalBodyElem = document.getElementById(
    StampInfoModalBodyID
  ) as HTMLElement;
  if (
    stampInfoModalElem != null &&
    stampInfoModalTitleElem != null &&
    stampInfoModalBodyElem != null
  ) {
    stampInfoModalElem.addEventListener("show.bs.modal", (e: Event) => {
      let elem = (e as MouseEvent).relatedTarget as HTMLDivElement;
      let stampElem = stampMap.get(elem.id);
      if (stampElem != null) {
        stampInfoModalTitleElem.innerHTML = stampElem.titleForModal;
        stampInfoModalBodyElem.innerHTML = stampElem.bodyForModal;
      }
    });
  }

  // Read fetched data from the file and prepare everything
  fetch("./static/assets/slowly.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((fileContents) => {
      let stampItems = fileContents["items"];
      stampItems.forEach((e: any) => {
        let elem = StampElement.fromJson(e, "./static/assets/{0}.webp");
        if (elem != null) {
          stampList.push(elem);
          stampMap.set(`${StampElementIDPrefix}${elem.id}`, elem);
        }
      });

      // Sort the items in the list, in descending order to the ID value. This
      // ensures that the items which were added the latest would be available
      // at the beginning
      stampList.sort((a, b) => b.id - a.id);

      // Create the Orchestrator for these stamps
      let stampsCountElem = document.getElementById(TotalStampsCountID);
      if (stampsCountElem == null) {
        return;
      }
      let navBarElem = document.getElementById(NavigationBarID);
      if (navBarElem == null) {
        return;
      }

      let o = new Orchestrator(navBarElem, stampsCountElem, containerElem, stampList);
      o.refresh();
    });
});
