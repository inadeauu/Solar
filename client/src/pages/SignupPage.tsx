import { AiOutlineHome } from "react-icons/ai"
import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ErrorCard from "../components/misc/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import TextInput from "../components/misc/TextInput"
import { graphql } from "../graphql_codegen/gql"
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { RegisterUsernameInput } from "../graphql_codegen/graphql"
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi"
import { debounce } from "lodash"
import { FieldState, FieldStates, initialFieldState } from "../types/shared"
import { setFieldStateSuccess, setFieldStateValue } from "../utils/form"
import { toast } from "react-toastify"
import { usernameExistsDocument } from "../graphql/sharedDocuments"

const usernameRegisterDocument = graphql(/* GraphQL */ `
  mutation RegisterUsername($input: RegisterUsernameInput!) {
    registerUsername(input: $input) {
      ... on RegisterUsernameSuccess {
        __typename
        successMsg
        code
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

interface FormFieldStates extends FieldStates {
  username: FieldState
  password: FieldState
  confirmPassword: FieldState
}

const initialFieldStates: FormFieldStates = {
  username: initialFieldState,
  password: initialFieldState,
  confirmPassword: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  USERNAME_LENGTH = "Username must be 5-15 characters long",
  USERNAME_TAKEN = "Username in use",
  PASSWORD_LENGTH = "Password must be at least 8 characters long",
  PASSWORD_MATCH = "Passwords do not match",
}

const SignupPage = () => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [validatingUsername, setValidatingUsername] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()

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
    } else if (password.length < 8) {
      error = FieldErrorMsgs.PASSWORD_LENGTH
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

  const getConfPasswordError = (confirmPassword: string) => {
    let error: string | undefined
    const password = fieldStates.password.value

    if (!confirmPassword) {
      error = FieldErrorMsgs.REQUIRED
    } else if (password !== confirmPassword) {
      error = FieldErrorMsgs.PASSWORD_MATCH
    }

    return error
  }

  const validateConfPassword = (confirmPassword: string) => {
    const error = getConfPasswordError(confirmPassword)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "confirmPassword", true)
    } else {
      setFieldStateSuccess(setFieldStates, "confirmPassword", false, error)
    }
  }

  const usernameRegister = useMutation({
    mutationFn: async ({ username, password }: RegisterUsernameInput) => {
      return await graphQLClient.request(usernameRegisterDocument, {
        input: { username, password },
      })
    },
    onSuccess: (data) => {
      if (data.registerUsername.__typename == "RegisterUsernameSuccess") {
        toast.success("Successfully registered")
        navigate("/login")
      } else if (
        data.registerUsername.__typename == "RegisterUsernameInputError"
      ) {
        setError(data.registerUsername.errorMsg)
      }
    },
  })

  const submitUsernameSignUp = async () => {
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

    const confPasswordSubmitError = !fieldStates.confirmPassword.success
      ? getConfPasswordError(fieldStates.confirmPassword.value)
      : fieldStates.confirmPassword.errorMsg

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

    confPasswordSubmitError !== fieldStates.confirmPassword.errorMsg &&
      setFieldStateSuccess(
        setFieldStates,
        "confirmPassword",
        false,
        confPasswordSubmitError
      )

    if (usernameSubmitError || passwordSubmitError || confPasswordSubmitError) {
      return
    }

    usernameRegister.mutate({
      username: fieldStates.username.value,
      password: fieldStates.password.value,
    })
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[450px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 hover:underline">
          <AiOutlineHome className="w-5 h-5" />
          <p className="text-sm mt-[1px]">Home</p>
        </Link>
        <form className="flex flex-col xs:w-[60%] xs-max:w-[80%] mx-auto mt-4">
          <h1 className="xs:text-3xl xs-max:text-2xl font-medium xs:mb-8 xs-max:mb-6">
            Sign Up
          </h1>
          {error && <ErrorCard error={error} className="mb-4" />}
          <TextInput
            name="username"
            type="text"
            placeholder="Username"
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
            success={fieldStates.username.success}
          />
          <div className="relative">
            <TextInput
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={fieldStates.password.value}
              onChange={(e) =>
                setFieldStateValue(setFieldStates, "password", e.target.value)
              }
              onBlur={(e) => validatePassword(e.target.value)}
              error={fieldStates.password.error}
              errorMsg={fieldStates.password.errorMsg}
              success={fieldStates.password.success}
            />
            <div
              className="absolute top-0 right-0 translate-x-[125%] translate-y-[10%]"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? (
                <PiEyeLight className="w-7 h-7" />
              ) : (
                <PiEyeSlashLight className="w-7 h-7" />
              )}
            </div>
          </div>
          <TextInput
            name="confirmPassword"
            type={showPass ? "text" : "password"}
            placeholder="Confirm Password"
            value={fieldStates.confirmPassword.value}
            onChange={(e) =>
              setFieldStateValue(
                setFieldStates,
                "confirmPassword",
                e.target.value
              )
            }
            onBlur={(e) => validateConfPassword(e.target.value)}
            error={fieldStates.confirmPassword.error}
            errorMsg={fieldStates.confirmPassword.errorMsg}
            success={fieldStates.confirmPassword.success}
          />
          <button
            type="button"
            data-testid="signup-form-submit"
            onClick={() => {
              submitUsernameSignUp()
              setSubmitting(false)
            }}
            className="btn_blue py-1 px-10 mt-2 mx-auto"
            disabled={submitting}
          >
            {submitting ? (
              <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="text-xs mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
