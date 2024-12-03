/**
 * Specialized version of `Object.keys()` which preserves the type information of the keys.
 *
 * Please note that the type information might be inaccurate for subtypes of the argument type
 * and thus should only be used to cover the property access of the object.
 *
 * @internal
 *
 * @param object The object to get the keys of.
 */
export function keys<T extends object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}
