const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export const numericCompare = (a: string, b: string) => collator.compare(a, b);
