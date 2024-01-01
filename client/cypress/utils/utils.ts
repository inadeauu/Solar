import { ClientError } from "graphql-request"

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
type nodeWithPost = node & { node: { post: { id: string } } }
type nodeWithParent = node & { node: { parent?: { id: string } | null } }

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

export const hasSamePostId = (arr: nodeWithPost[], postId: string) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.post.id == postId)
}

export const hasSameParentId = (arr: nodeWithParent[], parentId: string) => {
  if (arr.length == 0) return false

  return arr.every((e) => e.node.parent?.id == parentId)
}

export const cypressCheckOnFail = (errorCode: string, errorMsg: string) => {
  cy.on("fail", (error) => {
    if (error instanceof ClientError) {
      if (!error.response.errors || error.response.errors?.length == 0) throw new Error("No error returned")
      expect(error.response.errors[0].extensions.code).to.eq(errorCode)
      expect(error.response.errors[0].message).to.eq(errorMsg)
      return
    }

    throw new Error("Uncaught error (should not be reached)")
  })
}
