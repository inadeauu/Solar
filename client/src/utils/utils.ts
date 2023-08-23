export const pluralize = (count: number, noun: string, suffix = "s") => {
  if (count !== 1) {
    return noun + suffix
  }

  return noun
}

export const getReply = (count: number) => {
  if (count !== 1) {
    return "Replies"
  }

  return "Reply"
}
