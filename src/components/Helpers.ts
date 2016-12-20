export function getNumFormat(digits, decimals) {
  return function(n: number) {

    if (Number.isFinite(decimals)) {
      const pow = Math.pow(10, decimals);
      n = Math.round(pow * n) / pow;
    } else {
      n = 0;
    }

    let str: string = n + '';
    if (Number.isFinite(digits)) {
      let decimalIndx = str.indexOf('.');
      let existingDigits = decimalIndx > -1 ? decimalIndx : str.length;
      if (existingDigits < digits) {
        str = "0".repeat(digits - existingDigits) + str;
      }
    }

    if (Number.isFinite(decimals)) {
      let decimalIndx = str.indexOf('.');
      let curDec = decimalIndx > -1 ? str.length - decimalIndx : 0;
      if (decimalIndx === -1 && decimals > 0) {
        str += "."
      }
      if (curDec < decimals) {
        str = str + "0".repeat(decimals - curDec);
      }
    }

    return str;
  }
}