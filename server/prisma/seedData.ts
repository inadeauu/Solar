import { Provider } from "@prisma/client"

export const users = [
  {
    username: "username1",
    password: "$2b$10$tYMJbsTSEx/YaQUTpsMIMOI0HasnNplBWNB/zbTQY9zdVOQ06o5lC",
    provider: Provider.USERNAME,
  },
  {
    username: "username2",
    password: "$2b$10$BRCtrv3HsQUkCnMJoaSOWewJG3OpaTTggJGZLQzib1Wj69qb5rx16",
    provider: Provider.USERNAME,
  },
]

export const communities = ["community 1", "community 2"]

export const posts = [
  {
    title: "post 1",
    body: "post body 1",
  },
  {
    title: "post 2",
    body: "post body 2",
  },
  {
    title: "post 3",
    body: "post body 3",
  },
  {
    title: "post 4",
    body: "post body 4",
  },
]

export const comments = [
  {
    body: "comment 1",
    parentId: null,
  },
  {
    body: "comment 2",
    parentId: null,
  },
  {
    body: "comment 3",
    parentId: null,
  },
  {
    body: "comment 4",
    parentId: null,
  },
]
