import { Provider } from "@prisma/client"

export const users = [
  {
    id: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    username: "username1",
    password: "$2b$10$tYMJbsTSEx/YaQUTpsMIMOI0HasnNplBWNB/zbTQY9zdVOQ06o5lC",
    provider: Provider.USERNAME,
    created_at: "2023-02-27T23:47:05.637Z",
    updated_at: "2023-02-27T23:47:05.637Z",
  },
  {
    id: "266c189f-5986-404a-9889-0a54c298acb2",
    username: "username2",
    password: "$2b$10$BRCtrv3HsQUkCnMJoaSOWewJG3OpaTTggJGZLQzib1Wj69qb5rx16",
    provider: Provider.USERNAME,
    created_at: "2022-05-24T15:42:53.985Z",
    updated_at: "2022-05-24T15:42:53.985Z",
  },
  {
    id: "f734d0b4-20a1-4b7b-9d95-f5ad532582df",
    username: "username3",
    password: "$2b$10$BRCtrv3HsQUkCnMJoaSOWewJG3OpaTTggJGZLQzib1Wj69qb5rx16",
    provider: Provider.USERNAME,
    created_at: "2022-02-24T16:42:12.432Z",
    updated_at: "2022-02-24T16:42:12.432Z",
  },
]

export const communities = [
  {
    id: "351146cd-1612-4a44-94da-e33d27bedf39",
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    title: "Community 1",
    created_at: "2023-05-27T17:21:45.432Z",
    updated_at: "2023-05-27T17:21:45.432Z",
  },
  {
    id: "41094cb6-470d-4409-85b4-484fd43dd41d",
    userId: "266c189f-5986-404a-9889-0a54c298acb2",
    title: "Community 2",
    created_at: "2023-06-27T09:52:32.876Z",
    updated_at: "2023-06-27T09:52:12.876Z",
  },
]

export const posts = [
  {
    id: "351146cd-1612-4a44-94da-e33d27bedf39",
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
    title: "Post 1",
    body: "Post body 1",
    created_at: "2023-08-25T11:52:12.876Z",
    updated_at: "2023-08-25T11:52:12.876Z",
  },
  {
    id: "f19afc1b-1a61-4f93-b2b5-ce87d499feee",
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
    title: "Post 2",
    body: "Post body 2",
    created_at: "2023-09-26T11:52:12.876Z",
    updated_at: "2023-09-26T11:52:12.876Z",
  },
  {
    id: "86677911-05d4-4e65-a6b6-3ebdaea58b93",
    userId: "266c189f-5986-404a-9889-0a54c298acb2",
    communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
    title: "Post 3",
    body: "Post body 3",
    created_at: "2023-10-27T11:52:12.876Z",
    updated_at: "2023-10-27T11:52:12.876Z",
  },
  {
    id: "d98d07e1-e017-4359-bca5-20b95355181e",
    userId: "266c189f-5986-404a-9889-0a54c298acb2",
    communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
    title: "Post 4",
    body: "Post body 4",
    created_at: "2023-11-28T11:52:12.876Z",
    updated_at: "2023-11-28T11:52:12.876Z",
  },
  {
    id: "cfccc3c0-21b5-47f8-ab16-08f3ad2400c3",
    userId: "f734d0b4-20a1-4b7b-9d95-f5ad532582df",
    communityId: "351146cd-1612-4a44-94da-e33d27bedf39",
    title: "Post 5",
    body: "Post body 5",
    created_at: "2023-10-30T14:52:12.876Z",
    updated_at: "2023-10-30T14:52:12.876Z",
  },
]

export const comments = [
  {
    id: "0a990e52-64b7-44eb-bc27-63ee9410e80e",
    postId: "351146cd-1612-4a44-94da-e33d27bedf39",
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    parentId: null,
    body: "Comment 1",
    created_at: "2023-09-29T11:52:12.876Z",
    updated_at: "2023-09-29T11:52:12.876Z",
  },
  {
    id: "8c370158-6cb1-40b9-88b5-8e58aa84c856",
    postId: "351146cd-1612-4a44-94da-e33d27bedf39",
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    parentId: "0a990e52-64b7-44eb-bc27-63ee9410e80e",
    body: "Comment 2",
    created_at: "2023-10-30T11:52:12.876Z",
    updated_at: "2023-10-30T11:52:12.876Z",
  },
  {
    id: "36756cee-a0ce-40d3-a51d-686699e0b3a1",
    postId: "86677911-05d4-4e65-a6b6-3ebdaea58b93",
    userId: "266c189f-5986-404a-9889-0a54c298acb2",
    parentId: null,
    body: "Comment 3",
    created_at: "2023-11-30T11:23:12.876Z",
    updated_at: "2023-11-30T11:23:12.876Z",
  },
  {
    id: "3b9e9d61-8cd3-431c-994d-d433c7d20245",
    postId: "d98d07e1-e017-4359-bca5-20b95355181e",
    userId: "266c189f-5986-404a-9889-0a54c298acb2",
    parentId: null,
    body: "Comment 4",
    created_at: "2023-12-20T14:52:12.876Z",
    updated_at: "2023-12-20T14:52:12.876Z",
  },
  {
    id: "cb7250c3-e572-4dc7-9063-5c064b5a5ddb",
    postId: "d98d07e1-e017-4359-bca5-20b95355181e",
    userId: "f734d0b4-20a1-4b7b-9d95-f5ad532582df",
    parentId: null,
    body: "Comment 5",
    created_at: "2023-12-22T16:32:10.876Z",
    updated_at: "2023-12-22T16:32:10.876Z",
  },
]

export const inCommunities = [
  {
    userId: "8d2efb36-a726-425c-ad12-98f2683c5d86",
    communityId: "41094cb6-470d-4409-85b4-484fd43dd41d",
  },
]
