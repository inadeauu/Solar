import { AiOutlineArrowLeft } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import ErrorCard from "../components/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import { api } from "../utils/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { graphql } from "../gql"
import TextInput from "../components/TextInput"
import { LoginUsernameInput } from "../gql/graphql"
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
      ... on LoginUsernameInputError {
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

const Login = () => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const socialSignIn = async (provider: string) => {
    try {
      const response = await api.get(`/auth/${provider}`)

      window.location.assign(response.data.data.url)

      queryClient.invalidateQueries({ queryKey: ["user"] })
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error.message)
      }
    }
  }

  const usernameSignIn = useMutation({
    mutationFn: async ({ username, password }: LoginUsernameInput) => {
      return graphQLClient.request(usernameLoginDocument, {
        input: { username, password },
      })
    },
    onSuccess: (data) => {
      if (data.loginUsername.__typename == "LoginUsernameInputError") {
        setError(data.loginUsername.errorMsg)
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] })
        navigate("/")
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

  const inputStyle =
    "flex justify-center items-center gap-3 border border-neutral-500 rounded-full py-2 hover:bg-neutral-100 transition-colors duration-200"

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[550px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 items-center hover:underline">
          <AiOutlineArrowLeft className="w-4 h-4" />
          <p className="text-sm">Home</p>
        </Link>
        <form className="flex flex-col w-[60%] mx-auto mt-4">
          <h1 className="text-3xl font-semibold mb-8">Log In</h1>
          {error && <ErrorCard error={error} className="mb-4" />}
          <div className="flex flex-col gap-5">
            <button
              type="button"
              className={inputStyle}
              onClick={() => socialSignIn("google")}
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              type="button"
              className={inputStyle}
              onClick={() => socialSignIn("github")}
            >
              <BsGithub className="h-5 w-5" />
              Continue with Github
            </button>
          </div>
          <div className="flex my-3 items-center">
            <hr className="grow h-[2px] bg-black" />
            <div className="rounded-full p-3 border border-black relative">
              <p className="absolute translate-x-[-50%] translate-y-[-50%] text-sm font-light">
                or
              </p>
            </div>
            <hr className="grow h-[2px] bg-black" />
          </div>
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
            className="btn_blue py-2 mt-2 w-[60%] mx-auto"
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
              className="text-blue-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
