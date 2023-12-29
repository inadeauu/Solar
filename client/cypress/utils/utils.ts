type nodeWithId = {
  node: {
    id: string
  }
}

export const nodeIdsUnique = (arr: nodeWithId[]) => {
  const ids: string[] = []

  for (const item of arr) {
    if (ids.indexOf(item.node.id) >= 0) {
      return false
    } else {
      ids.push(item.node.id)
    }
  }

  return true
}
