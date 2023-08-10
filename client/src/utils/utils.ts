export const abbrNum = (num: number, fixed: number) => {
  if (num === null) {
    return null
  }
  if (num === 0) {
    return "0"
  }
  fixed = !fixed || fixed < 0 ? 0 : fixed
  const b = num.toPrecision(2).split("e")
  const k = b.length === 1 ? 0 : Math.floor(Math.min(+b[1].slice(1), 14) / 3)
  const c =
    k < 1
      ? +num.toFixed(0 + fixed)
      : +(num / Math.pow(10, k * 3)).toFixed(1 + fixed)
  const d = c < 0 ? c : Math.abs(c)
  const e = d + ["", "K", "M", "B", "T"][k]
  return e
}

export const pluralize = (count: number, noun: string, suffix = "s") => {
  if (count !== 1) {
    return noun + suffix
  }

  return noun
}
