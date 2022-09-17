export const format: (s: string, args: string[]) => string = (s, args) => {
  // store arguments in an array
  // use replace to iterate over the string
  // select the match and check if related argument is present
  // if yes, replace the match with the argument
  return s.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == "undefined" ? match : args[index];
  });
};

export const formatCountryString: (s: string | null) => string = (s) => {
  switch(s) {
    case null:
      return "NA";
    default:
      return s;
  }
}

export const formatRarityString: (s: string) => string = (s) => {
  switch(s) {
    case "-1":
      return "L0";
    case "1":
      return "L1"
    case "2":
      return "L2"
    default:
      return "L3"
  }
}

export const formatPriceString: (s: string) => string = (s) => {
  switch(s) {
    case "-1":
      return "free"
    case "0":
      return "free"
    case "1":
      return "premium"
    case "2":
      return "pricey"
    default:
      return "unknown"
  }
}