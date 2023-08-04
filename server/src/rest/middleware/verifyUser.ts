import { Request, Response, NextFunction } from "express"
import { errorResponse } from "../utils/response"
import { ResponseBody } from "../utils/response"

export const verifyUser = (
  req: Request,
  res: Response<ResponseBody>,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res
      .status(403)
      .json(errorResponse("Must be signed in", 403, req.path))
  }

  next()
}
