import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../../config/prisma"
import { Provider, User } from "@prisma/client"
import {
  Config,
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { generate } from "generate-password"
import { env } from "../utils/env"
import { oauth2Client } from "../utils/google"
import axios from "axios"
import { errorResponse, successResponse } from "../utils/response"
import bcrypt from "bcrypt"
import { ResponseBody } from "../utils/response"

type UserInfoGoogle = {
  iss: string
  azp?: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  at_hash?: string
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
  locale?: string
  iat: number
  exp: number
}

type UserInfoGithub = {
  login: string
  id: number
  avatar_url: string
}

type UserEmailGithub = {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}

type LoginCallbackQuery = {
  state: string
  code: string
}

export const getAuthUser = async (
  req: Request,
  res: Response<ResponseBody>
) => {
  if (req.session.userId) {
    const user = (await prisma.user.findFirst({
      where: { id: req.session.userId },
    })) as User

    const modifiedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified,
      provider: user.provider,
      image: user.image,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    return res.json(
      successResponse({ user: modifiedUser }, null, 200, req.path)
    )
  }

  return res.json(
    successResponse({ user: null }, "No signed in user", 200, req.path)
  )
}

export const googleLogin = (req: Request, res: Response<ResponseBody>) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ]

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
  const { state: stateQuery } = req.query
  const stateCookie = req.signedCookies.state

  if (stateQuery !== stateCookie) {
    return res
      .status(200)
      .json(errorResponse("Authentication error", 200, req.path))
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
    const config: Config = {
      dictionaries: [adjectives, colors, animals],
    }

    const username: string = uniqueNamesGenerator(config)

    const passwordHash = await bcrypt.hash(
      generate({ length: 32, numbers: true }),
      10
    )

    user = await prisma.user.create({
      data: {
        username: userInfo.name || username,
        email: userInfo.email,
        email_verified: userInfo.email_verified,
        password: passwordHash,
        provider: Provider.GOOGLE,
        provider_id: userInfo.sub,
        image: userInfo.picture,
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
  const { state: stateQuery } = req.query
  const stateCookie = req.signedCookies.state

  if (stateQuery !== stateCookie) {
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

  const userEmailResponse = await axios.get<UserEmailGithub[]>(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessResponse.data.access_token}`,
      },
    }
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
  const userEmail = userEmailResponse.data[0]

  let user: User | null

  user = await prisma.user.findFirst({
    where: { provider_id: userInfo.id.toString() },
  })

  if (!user) {
    const config: Config = {
      dictionaries: [adjectives, colors, animals],
    }

    const username: string = uniqueNamesGenerator(config)
    const passwordHash = await bcrypt.hash(
      generate({ length: 32, numbers: true }),
      10
    )

    user = await prisma.user.create({
      data: {
        username: userInfo.login || username,
        email: userEmail.email,
        email_verified: userEmail.verified,
        password: passwordHash,
        provider: Provider.GITHUB,
        provider_id: userInfo.id.toString(),
        image: userInfo.avatar_url,
      },
    })
  }

  req.session.userId = user.id

  return res.redirect(env.CLIENT_URL)
}

export const logout = (req: Request, res: Response<ResponseBody>) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json(errorResponse("Error logging out", 500, req.path))
    } else {
      return res
        .status(200)
        .json(successResponse(null, "Successfully logged out", 200, req.path))
    }
  })
}
