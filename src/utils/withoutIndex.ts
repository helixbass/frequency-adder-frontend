export const withoutIndex = <TItem>(index: number, array: TItem[]): TItem[] =>
  array.filter((_, currentIndex) => currentIndex !== index)
