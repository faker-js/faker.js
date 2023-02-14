/**
 * Type that provides auto-suggestions but also any string.
 *
 * @see https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609
 */
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & { zz_IGNORE_ME?: never });

/**
 * Type that represents a single method/function name of the given type.
 */
export type MethodOf<ObjectType, Signature extends () => void = () => void> = {
  [Key in keyof ObjectType]: ObjectType[Key] extends Signature
    ? Key extends string
      ? Key
      : never
    : never;
}[keyof ObjectType];

/**
 * Type that represents all method/function names of the given type.
 */
export type MethodsOf<
  ObjectType,
  Signature extends () => void = () => void
> = ReadonlyArray<MethodOf<ObjectType, Signature>>;
