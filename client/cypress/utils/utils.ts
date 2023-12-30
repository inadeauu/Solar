type node = {
  node: {
    id: string
  }
}

type nodeWithCreatedAt = node & { node: { created_at: string } }
type nodeWithVoteSum = node & { node: { voteSum: number } }
type nodeWithCommunityId = node & { node: { community: { id: string } } }
type nodeWithOwnerId = node & { node: { owner: { id: string } } }

export const nodeIdsUnique = (arr: node[]) => {
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
  return arr.every((e) => e.node.community.id == id)
}

export const hasSameOwnerId = (arr: nodeWithOwnerId[], id: string) => {
  return arr.every((e) => e.node.owner.id == id)
}
