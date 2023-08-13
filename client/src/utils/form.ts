import { FieldStates } from "../types/shared"

export const setFieldStateSuccess = <T extends FieldStates>(
  setFieldStates: React.Dispatch<React.SetStateAction<T>>,
  key: keyof T,
  success: boolean,
  errorMsg?: string
) => {
  if (success) {
    setFieldStates((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          success,
          error: !success,
          errorMsg: undefined,
        },
      }
    })
  } else {
    setFieldStates((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], success, error: !success, errorMsg },
      }
    })
  }
}

export const setFieldStateValue = <T extends FieldStates>(
  setFieldStates: React.Dispatch<React.SetStateAction<T>>,
  key: keyof T,
  value: string
) => {
  setFieldStates((prev) => {
    return {
      ...prev,
      [key]: { ...prev[key], value },
    }
  })
}
