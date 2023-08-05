import { Request, Response, NextFunction } from "express"
import { errorResponse, ResponseBody } from "../utils/response"

export const verifyUser = (
  req: Request,
  res: Response<ResponseBody>,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json(errorResponse("No authenticated user", 401, req.path))
  }

  next()
}
