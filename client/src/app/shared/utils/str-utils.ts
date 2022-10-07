export function toCamelCase(str: string): string {
  const inx = str.indexOf('_');
  let result;
  if (inx > 0) {
    result =
      str.slice(0, inx).toLowerCase() +
      str.slice(inx + 1, inx + 2).toUpperCase() +
      str.slice(inx + 2).toLowerCase();
  } else {
    result = str.toLowerCase();
  }
  return result;
}

// const getSearchParams = (str: string): any => {
//   if (!str) return [];
//   const rex = /\.([a-z-_1-9;]+)/gim;
//   const newStr = str.split(rex)[1];
//   if (newStr) {
//     return newStr.toUpperCase().split(';');
//   } else {
//     return [];
//   }
// };
