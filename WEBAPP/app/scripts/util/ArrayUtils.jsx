export function aoIndexOf(myArray, searchTerm, property) {
  if (myArray) {
    for (let i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }
  return -1;
}

export function aoObjectOf(myArray, searchTerm, property) {
  if (myArray) {
    if (typeof searchTerm === 'boolean') {
      if (searchTerm) {
        for (let i = 0, len = myArray.length; i < len; i++) {
          if (myArray[i][property]) return myArray[i];
        }
      } else {
        for (let i = 0, len = myArray.length; i < len; i++) {
          if (!myArray[i][property]) return myArray[i];
        }
      }
    }
    for (let i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return myArray[i];
    }
    return {};
  }
  return {};
}

export function sumArrayValues(myArray, property) {
  let total = 0;
  if (!myArray) {
    return 0;
  }
  for (let i = 0, len = myArray.length; i < len; i++) {
    total = total + myArray[i][property];
  }
  return total;
}

export function calculateHours(occurrences, formaDid) {
  let hoursTotalByFormaDid = 0;
  for (let i = 0; i < occurrences.length; i++) {
    if (occurrences[i].idFormaDid === formaDid) {
      hoursTotalByFormaDid = hoursTotalByFormaDid + parseFloat(occurrences[i].durata);
    }
  }
  return hoursTotalByFormaDid;
}

export function hasMultipleFormeDid(occurrences) {
  let i = 0;
  while (i < occurrences.length) {
    if (occurrences[i].idFormaDid !== occurrences[++i]) {
      return true;
    }
  }
  return false;
}
