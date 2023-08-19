export type FieldStates = {
  [x: string]: FieldState
}

export type FieldState = {
  value: string
  success: boolean
  error: boolean
  errorMsg?: string
}

export const initialFieldState: FieldState = {
  value: "",
  success: false,
  error: false,
}

export type Flatten<T> = T extends any[] ? T[number] : T
