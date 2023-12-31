type node = {
  node: {
    id: string
  }
}

type nodeWithCreatedAt = node & { node: { created_at: string } }
type nodeWithVoteSum = node & { node: { voteSum: number } }
type nodeWithCommunityId = node & { node: { community: { id: string } } }
type nodeWithOwnerId = node & { node: { owner: { id: string } } }
type nodeWithTitle = node & { node: { title: string } }
type nodeWithInCommunity = node & { node: { inCommunity: boolean } }

export const nodeIdsUnique = (arr: node[]) => {
  if (arr.length == 0) return false

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

export const hasNewOrdering = (arr: nodeWithCreatedAt[]) => {
  if (arr.length == 0) return false

  return arr.every((e, i) => {
    if (i == 0) {
      return e.node.created_at > arr[i + 1].node.created_at
    } else if (i == arr.length - 1) {
      return e.node.created_at < arr[i - 1].node.created_at
    } else {
      return e.node.created_at > arr[i + 1].node.created_at && e.node.created_at < arr[i - 1].node.created_at
    }
  })
}

export const hasOldOrdering = (arr: nodeWithCreatedAt[]) => {
  if (arr.length == 0) return false

  return arr.every((e, i) => {
    if (i == 0) {
      return e.node.created_at < arr[i + 1].node.created_at
    } else if (i == arr.length - 1) {
      return e.node.created_at > arr[i - 1].node.created_at
    } else {
      return e.node.created_at < arr[i + 1].node.created_at && e.node.created_at > arr[i - 1].node.created_at
    }
  })
}

export const hasIncreasingVoteSumOrdering = (arr: nodeWithVoteSum[]) => {
  if (arr.length == 0) return false

  return arr.every((e, i) => {
    if (i == 0) {
      return e.node.voteSum <= arr[i + 1].node.voteSum
    } else if (i == arr.length - 1) {
      return e.node.voteSum >= arr[i - 1].node.voteSum
    } else {
      return e.node.voteSum <= arr[i + 1].node.voteSum && e.node.voteSum >= arr[i - 1].node.voteSum
    }
  })
}

export const hasDecreasingVoteSumOrdering = (arr: nodeWithVoteSum[]) => {
  if (arr.length == 0) return false

  return arr.every((e, i) => {
    if (i == 0) {
      return e.node.voteSum >= arr[i + 1].node.voteSum
    } else if (i == arr.length - 1) {
      return e.node.voteSum <= arr[i - 1].node.voteSum
    } else {
      return e.node.voteSum >= arr[i + 1].node.voteSum && e.node.voteSum <= arr[i - 1].node.voteSum
    }
  })
}

export const hasSameCommunityId = (arr: nodeWithCommunityId[], id: string) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.community.id == id)
}

export const hasSameOwnerId = (arr: nodeWithOwnerId[], id: string) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.owner.id == id)
}

export const allTitlesContain = (arr: nodeWithTitle[], str: string) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.title.includes(str) == true)
}

export const titlesInAlphabeticalOrder = (arr: nodeWithTitle[]) => {
  if (arr.length == 0) return false

  return arr.every((e, i) => {
    if (i == 0) {
      return e.node.title <= arr[i + 1].node.title
    } else if (i == arr.length - 1) {
      return e.node.title >= arr[i - 1].node.title
    } else {
      return e.node.title <= arr[i + 1].node.title && e.node.title >= arr[i - 1].node.title
    }
  })
}

export const inAllCommunities = (arr: nodeWithInCommunity[]) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.inCommunity == true)
}
