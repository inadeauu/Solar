import { AiOutlineHome } from "react-icons/ai"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ErrorCard from "../components/misc/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { graphql } from "../graphql_codegen/gql"
import TextInput from "../components/misc/TextInput"
import { LoginUsernameInput } from "../graphql_codegen/graphql"
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi"
import { FieldState, FieldStates, initialFieldState } from "../types/shared"
import { setFieldStateSuccess, setFieldStateValue } from "../utils/form"

const usernameLoginDocument = graphql(/* GraphQL */ `
  mutation LoginUsername($input: LoginUsernameInput!) {
    loginUsername(input: $input) {
      ... on LoginUsernameSuccess {
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
}

const initialFieldStates: FormFieldStates = {
  username: initialFieldState,
  password: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
}

const LoginPage = () => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()

  const getUsernameError = (username: string) => {
    let error: string | undefined

    if (!username) {
      error = FieldErrorMsgs.REQUIRED
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

  const usernameSignIn = useMutation({
    mutationFn: async ({ username, password }: LoginUsernameInput) => {
      return graphQLClient.request(usernameLoginDocument, {
        input: { username, password },
      })
    },
    onSuccess: (data) => {
      if (data.loginUsername.__typename == "LoginUsernameSuccess") {
        navigate("/")
      } else if (data.loginUsername.__typename == "LoginUsernameInputError") {
        setError(data.loginUsername.errorMsg)
      }
    },
  })

  const submitUsernameLogin = async () => {
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

    usernameSignIn.mutate({
      username: fieldStates.username.value,
      password: fieldStates.password.value,
    })
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[400px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 hover:underline">
          <AiOutlineHome className="w-5 h-5" />
          <p className="text-sm mt-[1px]">Home</p>
        </Link>
        <form className="flex flex-col xs:w-[60%] xs-max:w-[80%] mx-auto mt-4">
          <h1 className="xs:text-3xl xs-max:text-2xl font-medium xs:mb-8 xs-max:mb-6">
            Log In
          </h1>
          {error && <ErrorCard error={error} className="mb-4" />}
          <TextInput
            name="username"
            type="text"
            placeholder="Username"
            value={fieldStates.username.value}
            onChange={(e) =>
              setFieldStateValue(setFieldStates, "username", e.target.value)
            }
            onBlur={(e) => {
              validateUsername(e.target.value)
            }}
            error={fieldStates.username.error}
            errorMsg={fieldStates.username.errorMsg}
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
          <button
            type="button"
            onClick={() => {
              submitUsernameLogin()
              setSubmitting(false)
            }}
            className="btn_blue py-1 px-10 mt-2 mx-auto"
            disabled={submitting}
          >
            {submitting ? (
              <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
            ) : (
              "Log In"
            )}
          </button>
          <p className="text-xs mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
