export default function isOneOf<T extends any[] | readonly any[]>(
  val: unknown,
  arr: T,
): val is T[number] {
  return arr.indexOf(val) > -1;
}
