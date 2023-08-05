import moment from "moment"

export interface SuccessResponse {
  data: Object | null
  message: string | null
  status: number
  timestamp: string
  path: string
}

export interface ErrorResponse {
  error: {
    message: string | null
    status: number
    timestamp: string
    path: string
  }
}

export type ResponseBody = SuccessResponse | ErrorResponse

export function successResponse(
  data: Object | null,
  message: string | null,
  status: number,
  path: string
): SuccessResponse {
  const resoonse: SuccessResponse = {
    data,
    message,
    status,
    timestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    path,
  }

  return resoonse
}

export function errorResponse(
  message: string | null,
  status: number,
  path: string
): ErrorResponse {
  const response: ErrorResponse = {
    error: {
      message,
      status,
      timestamp: moment(Date.now()).format("YYY-MM-DD HH:mm:ss"),
      path,
    },
  }

  return response
}
