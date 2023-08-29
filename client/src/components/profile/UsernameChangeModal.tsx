import { useCallback, useState } from "react"
import Modal from "../misc/Modal"
import TextInput from "../misc/TextInput"
import { ImSpinner11 } from "react-icons/im"
import { FieldState, FieldStates, initialFieldState } from "../../types/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { usernameExistsDocument } from "../../graphql/sharedDocuments"
import { debounce } from "lodash"
import { setFieldStateSuccess, setFieldStateValue } from "../../utils/form"
import { graphql } from "../../graphql_codegen"
import {
  AuthUserQuery,
  ChangeUsernameInput,
} from "../../graphql_codegen/graphql"
import { toast } from "react-toastify"

const changeUsernameDocument = graphql(/* GraphQL */ `
  mutation ChangeUsername($input: ChangeUsernameInput!) {
    changeUsername(input: $input) {
      ... on ChangeUsernameSuccess {
        __typename
        successMsg
        code
        user {
          username
          updated_at
          provider
          id
          created_at
        }
      }
      ... on ChangeUsernameInputError {
        __typename
        errorMsg
        code
        inputErrors {
          username
          password
        }
      }
    }
  }
`)

type UsernameChangeModalProps = {
  isOpen: boolean
  onClose: (...any: any[]) => any
}

interface FormFieldStates extends FieldStates {
  password: FieldState
  username: FieldState
}

const initialFieldStates: FormFieldStates = {
  password: initialFieldState,
  username: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  USERNAME_LENGTH = "Username must be 5-15 characters long",
  USERNAME_TAKEN = "Username already in use",
  PASSWORD_MATCH = "Incorrect password",
}

const UsernameChangeModal = ({ isOpen, onClose }: UsernameChangeModalProps) => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [validatingUsername, setValidatingUsername] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const changeUsername = useMutation({
    mutationFn: async ({ newUsername, password }: ChangeUsernameInput) => {
      return await graphQLClient.request(changeUsernameDocument, {
        input: { newUsername, password },
      })
    },
    onSuccess: (data) => {
      if (data.changeUsername.__typename == "ChangeUsernameSuccess") {
        const updatedUser = data.changeUsername.user
        toast.success("Successfully changed username")
        fieldStates.username = initialFieldState
        fieldStates.password = initialFieldState
        queryClient.setQueryData<AuthUserQuery>(["authUser"], (oldData) => {
          return oldData
            ? {
                ...oldData,
                authUser: {
                  ...oldData.authUser,
                  user: updatedUser,
                },
              }
            : oldData
        })
        onClose()
      } else if (data.changeUsername.__typename == "ChangeUsernameInputError") {
        if (data.changeUsername.inputErrors.username) {
          setFieldStateSuccess(
            setFieldStates,
            "username",
            false,
            data.changeUsername.inputErrors.username
          )
        }

        if (data.changeUsername.inputErrors.password) {
          setFieldStateSuccess(
            setFieldStates,
            "password",
            false,
            data.changeUsername.inputErrors.password
          )
        }
      }
    },
  })

  const getUsernameError = async (username: string) => {
    let error: string | undefined

    if (!username) {
      error = FieldErrorMsgs.REQUIRED
    } else if (username.length < 5 || username.length > 15) {
      error = FieldErrorMsgs.USERNAME_LENGTH
    } else {
      const response = await graphQLClient.request(usernameExistsDocument, {
        username,
      })

      if (response.usernameExists) {
        error = FieldErrorMsgs.USERNAME_TAKEN
      }
    }

    return error
  }

  const validateUsername = useCallback(
    debounce(
      async (username: string) => {
        setValidatingUsername(true)

        const error = await getUsernameError(username)

        if (!error) {
          setFieldStateSuccess(setFieldStates, "username", true)
        } else {
          setFieldStateSuccess(setFieldStates, "username", false, error)
        }

        setValidatingUsername(false)
      },
      500,
      { trailing: true }
    ),
    []
  )

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

  const submitUsernameChange = async () => {
    setSubmitting(true)

    if (validatingUsername) {
      return
    }

    const usernameSubmitError =
      fieldStates.username.errorMsg == FieldErrorMsgs.USERNAME_TAKEN
        ? FieldErrorMsgs.USERNAME_TAKEN
        : !fieldStates.username.success
        ? await getUsernameError(fieldStates.username.value)
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

    changeUsername.mutate({
      newUsername: fieldStates.username.value,
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
        <h1 className="text-xl font-medium mb-4">Change Username</h1>
        <div className="flex flex-col">
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
          <TextInput
            name="newUsername"
            type="text"
            placeholder="New Username"
            value={fieldStates.username.value}
            onChange={(e) => {
              setFieldStateValue(
                setFieldStates,
                "username",
                e.target.value.trim()
              )
              validateUsername(e.target.value.trim())
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                setFieldStateSuccess(
                  setFieldStates,
                  "username",
                  false,
                  FieldErrorMsgs.REQUIRED
                )
              }
            }}
            error={fieldStates.username.error}
            errorMsg={fieldStates.username.errorMsg}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            submitUsernameChange()
            setSubmitting(false)
          }}
          className="btn_blue py-1 px-2 mt-2 self-end text-sm disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? (
            <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </Modal>
  )
}

export default UsernameChangeModal
