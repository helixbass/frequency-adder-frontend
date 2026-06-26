// export const assertNonNullish = <TValue>(value: TValue, message?: string): asserts value is NonNullable<TValue> => {
//   if (value == null) {
//     throw new Error(message ?? "expected non-nullish")
//   }
// }

export const checkNonNullish = <TValue>(value: TValue, message?: string): NonNullable<TValue> => {
  if (value == null) {
    throw new Error(message ?? "expected non-nullish")
  }
  return value
}
