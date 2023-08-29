import { useState } from "react"
import Modal from "../../misc/Modal"
import TextInput from "../../misc/TextInput"
import { ImSpinner11 } from "react-icons/im"
import {
  FieldState,
  FieldStates,
  initialFieldState,
} from "../../../types/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../../../utils/graphql"
import { setFieldStateSuccess, setFieldStateValue } from "../../../utils/form"
import { graphql } from "../../../graphql_codegen"
import {
  AuthUserQuery,
  DeleteUserInput,
} from "../../../graphql_codegen/graphql"
import { toast } from "react-toastify"
import { useAuth } from "../../../hooks/useAuth"
import Cookie from "js-cookie"
import { useNavigate } from "react-router-dom"

const deleteUserDocument = graphql(/* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      ... on DeleteUserSuccess {
        __typename
        successMsg
        code
      }
      ... on DeleteUserInputError {
        __typename
        errorMsg
        code
        inputErrors {
          password
          username
        }
      }
    }
  }
`)

type DeleteAccountModalProps = {
  isOpen: boolean
  onClose: (...any: any[]) => any
}

interface FormFieldStates extends FieldStates {
  username: FieldState
  password: FieldState
}

const initialFieldStates: FormFieldStates = {
  username: initialFieldState,
  password: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  USERNAME_MATCH = "Please enter your username",
  PASSWORD_MATCH = "Incorrect password",
}

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const deleteAccount = useMutation({
    mutationFn: async ({ username, password }: DeleteUserInput) => {
      return await graphQLClient.request(deleteUserDocument, {
        input: { username, password },
      })
    },
    onSuccess: (data) => {
      if (data.deleteUser.__typename == "DeleteUserSuccess") {
        fieldStates.username = initialFieldState
        fieldStates.password = initialFieldState
        toast.success("Successfully deleted account")
        Cookie.remove("connect.sid")
        onClose()
        queryClient.setQueryData<AuthUserQuery>(["authUser"], (oldData) =>
          oldData
            ? { ...oldData, authUser: { ...oldData.authUser, user: null } }
            : oldData
        )
        navigate("/")
      } else if (data.deleteUser.__typename == "DeleteUserInputError") {
        if (data.deleteUser.inputErrors.username) {
          setFieldStateSuccess(
            setFieldStates,
            "username",
            false,
            data.deleteUser.inputErrors.username
          )
        }

        if (data.deleteUser.inputErrors.password) {
          setFieldStateSuccess(
            setFieldStates,
            "password",
            false,
            data.deleteUser.inputErrors.password
          )
        }
      }
    },
  })

  const getUsernameError = (username: string) => {
    let error: string | undefined

    if (!username) {
      error = FieldErrorMsgs.REQUIRED
    } else if (username !== user?.username) {
      error = FieldErrorMsgs.USERNAME_MATCH
    }

    return error
  }

  const validateUsername = (username: string) => {
    const error = getUsernameError(username)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "username", true)
    } else {
      setFieldStateSuccess(setFieldStates, "username", false, error)
    }
  }

  const getPasswordError = (password: string) => {
    let error: string | undefined

    if (!password) {
      error = FieldErrorMsgs.REQUIRED
    }

    return error
  }

  const validatePassword = (password: string) => {
    const error = getPasswordError(password)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "password", true)
    } else {
      setFieldStateSuccess(setFieldStates, "password", false, error)
    }
  }

  const submitDeleteAccount = async () => {
    setSubmitting(true)

    const usernameSubmitError = !fieldStates.username.success
      ? getUsernameError(fieldStates.username.value)
      : fieldStates.username.errorMsg

    const passwordSubmitError = !fieldStates.password.success
      ? getPasswordError(fieldStates.password.value)
      : fieldStates.password.errorMsg

    usernameSubmitError !== fieldStates.username.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "username",
        false,
        usernameSubmitError
      )

    passwordSubmitError !== fieldStates.password.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "password",
        false,
        passwordSubmitError
      )

    if (usernameSubmitError || passwordSubmitError) {
      return
    }

    deleteAccount.mutate({
      username: fieldStates.username.value,
      password: fieldStates.password.value,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        fieldStates.username = initialFieldState
        fieldStates.password = initialFieldState
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-medium">Delete Account</h1>
          <p className="text-sm">
            This will delete everything, including all of your posts and
            comments.
          </p>
        </div>
        <div className="flex flex-col">
          <TextInput
            name="newUsername"
            type="text"
            placeholder="Username"
            value={fieldStates.username.value}
            onChange={(e) => {
              setFieldStateValue(setFieldStates, "username", e.target.value)
            }}
            onBlur={(e) => {
              validateUsername(e.target.value)
            }}
            error={fieldStates.username.error}
            errorMsg={fieldStates.username.errorMsg}
          />
          <TextInput
            name="password"
            type="password"
            placeholder="Password"
            value={fieldStates.password.value}
            onChange={(e) =>
              setFieldStateValue(setFieldStates, "password", e.target.value)
            }
            onBlur={(e) => validatePassword(e.target.value)}
            error={fieldStates.password.error}
            errorMsg={fieldStates.password.errorMsg}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            submitDeleteAccount()
            setSubmitting(false)
          }}
          className="btn_red py-1 px-2 mt-2 self-end text-sm disabled:bg-red-300"
          disabled={submitting}
        >
          {submitting ? (
            <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
          ) : (
            "Delete"
          )}
        </button>
      </form>
    </Modal>
  )
}

export default DeleteAccountModal
