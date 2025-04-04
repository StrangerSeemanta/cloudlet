export function removeAllItemArray(
  arr: string[] | number[],
  value: string | number
) {
  for (const i in arr) {
    if (arr[i] === value) {
      arr.splice(Number(i), 1);
    }
  }
  return arr;
}
