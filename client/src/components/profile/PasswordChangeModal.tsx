import { useState } from "react"
import Modal from "../misc/Modal"
import TextInput from "../misc/TextInput"
import { ImSpinner11 } from "react-icons/im"
import { FieldState, FieldStates, initialFieldState } from "../../types/shared"
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { setFieldStateSuccess, setFieldStateValue } from "../../utils/form"
import { graphql } from "../../graphql_codegen"
import { ChangePasswordInput } from "../../graphql_codegen/graphql"
import { toast } from "react-toastify"

const changePasswordDocument = graphql(/* GraphQL */ `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ... on ChangePasswordSuccess {
        __typename
        successMsg
        code
      }
      ... on ChangePasswordInputError {
        __typename
        errorMsg
        code
        inputErrors {
          currentPassword
          newPassword
        }
      }
    }
  }
`)

type PasswordChangeModalProps = {
  isOpen: boolean
  onClose: (...any: any[]) => any
}

interface FormFieldStates extends FieldStates {
  currentPassword: FieldState
  newPassword: FieldState
  confirmPassword: FieldState
}

const initialFieldStates: FormFieldStates = {
  currentPassword: initialFieldState,
  newPassword: initialFieldState,
  confirmPassword: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  PASSWORD_LENGTH = "Password must be at least 8 characters long",
  PASSWORD_CONFIRM_MATCH = "Passwords do not match",
  PASSWORD_MATCH = "Incorrect password",
}

const PasswordChangeModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const changePassword = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: ChangePasswordInput) => {
      return await graphQLClient.request(changePasswordDocument, {
        input: { currentPassword, newPassword },
      })
    },
    onSuccess: (data) => {
      if (data.changePassword.__typename == "ChangePasswordSuccess") {
        fieldStates.currentPassword = initialFieldState
        fieldStates.newPassword = initialFieldState
        fieldStates.confirmPassword = initialFieldState
        toast.success("Successfully changed password")
        onClose()
      } else if (data.changePassword.__typename == "ChangePasswordInputError") {
        if (data.changePassword.inputErrors.currentPassword) {
          setFieldStateSuccess(
            setFieldStates,
            "currentPassword",
            false,
            data.changePassword.inputErrors.currentPassword
          )
        }

        if (data.changePassword.inputErrors.newPassword) {
          setFieldStateSuccess(
            setFieldStates,
            "newPassword",
            false,
            data.changePassword.inputErrors.newPassword
          )
        }
      }
    },
  })

  const getCurrentPasswordError = (password: string) => {
    let error: string | undefined

    if (!password) {
      error = FieldErrorMsgs.REQUIRED
    }

    return error
  }

  const validateCurrentPassword = (password: string) => {
    const error = getCurrentPasswordError(password)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "currentPassword", true)
    } else {
      setFieldStateSuccess(setFieldStates, "currentPassword", false, error)
    }
  }

  const getNewPasswordError = (newPassword: string) => {
    let error: string | undefined

    if (!newPassword) {
      error = FieldErrorMsgs.REQUIRED
    } else if (newPassword.length < 8) {
      error = FieldErrorMsgs.PASSWORD_LENGTH
    }

    return error
  }

  const validateNewPassword = (newPassword: string) => {
    const error = getNewPasswordError(newPassword)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "newPassword", true)
    } else {
      setFieldStateSuccess(setFieldStates, "newPassword", false, error)
    }
  }

  const getConfirmNewPasswordError = (confirmPassword: string) => {
    let error: string | undefined
    const newPassword = fieldStates.newPassword.value

    if (!confirmPassword) {
      error = FieldErrorMsgs.REQUIRED
    } else if (newPassword !== confirmPassword) {
      error = FieldErrorMsgs.PASSWORD_CONFIRM_MATCH
    }

    return error
  }

  const validateConfirmPassword = (newPassword: string) => {
    const error = getConfirmNewPasswordError(newPassword)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "confirmPassword", true)
    } else {
      setFieldStateSuccess(setFieldStates, "confirmPassword", false, error)
    }
  }

  const submitPasswordChange = async () => {
    setSubmitting(true)

    const currentPasswordSubmitError = !fieldStates.currentPassword.success
      ? getCurrentPasswordError(fieldStates.currentPassword.value)
      : fieldStates.currentPassword.errorMsg

    const newPasswordSubmitError = !fieldStates.newPassword.success
      ? getNewPasswordError(fieldStates.newPassword.value)
      : fieldStates.newPassword.errorMsg

    const confirmNewPasswordSubmitError = !fieldStates.confirmPassword.success
      ? getConfirmNewPasswordError(fieldStates.confirmPassword.value)
      : fieldStates.confirmPassword.errorMsg

    currentPasswordSubmitError !== fieldStates.currentPassword.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "currentPassword",
        false,
        currentPasswordSubmitError
      )

    newPasswordSubmitError !== fieldStates.newPassword.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "newPassword",
        false,
        newPasswordSubmitError
      )

    confirmNewPasswordSubmitError !== fieldStates.confirmPassword.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "confirmPassword",
        false,
        confirmNewPasswordSubmitError
      )

    if (
      currentPasswordSubmitError ||
      newPasswordSubmitError ||
      confirmNewPasswordSubmitError
    ) {
      return
    }

    changePassword.mutate({
      currentPassword: fieldStates.currentPassword.value,
      newPassword: fieldStates.newPassword.value,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        fieldStates.currentPassword = initialFieldState
        fieldStates.newPassword = initialFieldState
        fieldStates.confirmPassword = initialFieldState
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <h1 className="text-xl font-medium mb-4">Change Password</h1>
        <div className="flex flex-col">
          <TextInput
            name="currentPassword"
            type="password"
            placeholder="Current Password"
            value={fieldStates.currentPassword.value}
            onChange={(e) =>
              setFieldStateValue(
                setFieldStates,
                "currentPassword",
                e.target.value
              )
            }
            onBlur={(e) => validateCurrentPassword(e.target.value)}
            error={fieldStates.currentPassword.error}
            errorMsg={fieldStates.currentPassword.errorMsg}
          />
          <TextInput
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={fieldStates.newPassword.value}
            onChange={(e) => {
              setFieldStateValue(setFieldStates, "newPassword", e.target.value)
            }}
            onBlur={(e) => validateNewPassword(e.target.value)}
            error={fieldStates.newPassword.error}
            errorMsg={fieldStates.newPassword.errorMsg}
          />
          <TextInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={fieldStates.confirmPassword.value}
            onChange={(e) => {
              setFieldStateValue(
                setFieldStates,
                "confirmPassword",
                e.target.value
              )
            }}
            onBlur={(e) => validateConfirmPassword(e.target.value)}
            error={fieldStates.confirmPassword.error}
            errorMsg={fieldStates.confirmPassword.errorMsg}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            submitPasswordChange()
            setSubmitting(false)
          }}
          className="btn_blue py-1 px-2 mt-2 self-end text-sm disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? (
            <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </Modal>
  )
}

export default PasswordChangeModal
