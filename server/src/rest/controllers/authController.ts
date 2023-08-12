import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../../config/prisma"
import axios from "axios"
import bcrypt from "bcrypt"
import { Provider, User } from "@prisma/client"
import {
  Config,
  NumberDictionary,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { generate } from "generate-password"
import { env } from "../../config/env"
import { oauth2Client } from "../utils/google"
import { errorResponse, successResponse, ResponseBody } from "../utils/response"

type UserInfoGoogle = {
  sub: string
}

type UserInfoGithub = {
  id: number
}

type LoginCallbackQuery = {
  state: string
  code: string
}

const numberDictionary = NumberDictionary.generate({
  min: 1000,
  max: 99999,
})

const nameConfig: Config = {
  dictionaries: [colors, numberDictionary],
}

const generateUsername = async (): Promise<string> => {
  let username: string = uniqueNamesGenerator(nameConfig)

  while (await prisma.user.findFirst({ where: { username } })) {
    username = uniqueNamesGenerator(nameConfig)
  }

  return username
}

export const googleLogin = (req: Request, res: Response<ResponseBody>) => {
  const scopes = ["https://www.googleapis.com/auth/userinfo.profile"]

  const state = generate({ numbers: true, length: 32 })

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state,
  })

  res.cookie("state", state, { httpOnly: true, signed: true })

  return res
    .status(200)
    .json(successResponse({ url: authorizationUrl }, null, 200, req.path))
}

export const googleCallback = async (
  req: Request<{}, {}, {}, LoginCallbackQuery>,
  res: Response<ResponseBody>
) => {
  const state = req.query.state
  const stateCookie = req.signedCookies.state

  if (state !== stateCookie) {
    return res
      .status(500)
      .json(errorResponse("Error logging in", 500, req.path))
  }

  res.clearCookie("state")

  const code = req.query.code
  let { tokens } = await oauth2Client.getToken(code)
  const userInfo = jwt.decode(tokens.id_token!) as UserInfoGoogle

  let user: User | null

  user = await prisma.user.findFirst({
    where: { provider_id: userInfo.sub },
  })

  if (!user) {
    const username = await generateUsername()

    const passwordHash = await bcrypt.hash(
      generate({ length: 32, numbers: true }),
      10
    )

    user = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        provider: Provider.GOOGLE,
        provider_id: userInfo.sub,
      },
    })
  }

  req.session.userId = user.id

  return res.redirect(env.CLIENT_URL)
}

export const githubLogin = (req: Request, res: Response<ResponseBody>) => {
  const base = "https://github.com/login/oauth/authorize"

  const state = generate({ numbers: true, length: 32 })

  const add_params = {
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.GITHUB_REDIRECT_URL,
    scope: "read:user user:email",
    state,
  }

  const params = new URLSearchParams(add_params)

  res.cookie("state", state, { httpOnly: true, signed: true })

  return res
    .status(200)
    .json(
      successResponse(
        { url: `${base}?${params.toString()}` },
        null,
        200,
        req.path
      )
    )
}

export const githubCallback = async (
  req: Request<{}, {}, {}, LoginCallbackQuery>,
  res: Response<ResponseBody>
) => {
  const state = req.query.state
  const stateCookie = req.signedCookies.state

  if (state !== stateCookie) {
    return res
      .status(500)
      .json(errorResponse("Error logging in", 500, req.path))
  }

  res.clearCookie("state")

  const code = req.query.code

  const add_params = {
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code: code,
  }

  const params = new URLSearchParams(add_params)

  const accessResponse = await axios.post(
    `https://github.com/login/oauth/access_token?${params}`,
    {},
    { headers: { Accept: "application/json" } }
  )

  const userInfoResponse = await axios.get<UserInfoGithub>(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessResponse.data.access_token}`,
      },
    }
  )

  const userInfo = userInfoResponse.data

  let user: User | null

  user = await prisma.user.findFirst({
    where: { provider_id: userInfo.id.toString() },
  })

  if (!user) {
    const username = await generateUsername()

    const passwordHash = await bcrypt.hash(
      generate({ length: 32, numbers: true }),
      10
    )

    user = await prisma.user.create({
      data: {
        username,
        password: passwordHash,
        provider: Provider.GITHUB,
        provider_id: userInfo.id.toString(),
      },
    })
  }

  req.session.userId = user.id

  return res.redirect(env.CLIENT_URL)
}
