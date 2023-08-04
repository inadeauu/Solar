import { Request, Response, NextFunction } from "express"
import { ResponseBody, errorResponse } from "../utils/response"

const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ResponseBody>,
  next: NextFunction
) => {
  const status = res.statusCode ? res.statusCode : 500
  res.status(status)
  return res.json(errorResponse(err.message, status, req.path))
}

export default errorHandler
