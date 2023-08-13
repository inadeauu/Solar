import { AiOutlineArrowLeft } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs"
import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import ErrorCard from "../components/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import TextInput from "../components/TextInput"
import { api } from "../utils/axios"
import { graphql } from "../gql"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { RegisterUsernameInput } from "../gql/graphql"
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi"
import { debounce } from "lodash"

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
      ... on RegisterUsernameInputError {
        inputErrors {
          password
          username
        }
      }
    }
  }
`)

const usernameExistsDocument = graphql(/* GraphQL */ `
  query UsernameExists($username: String!) {
    usernameExists(username: $username)
  }
`)

type FieldState = {
  value: string
  success: boolean
  error: boolean
  errorMsg?: string
}

type FieldStates = {
  username: FieldState
  password: FieldState
  confirmPassword: FieldState
}

const initialFieldState: FieldState = {
  value: "",
  success: false,
  error: false,
}

const initialFieldStates: FieldStates = {
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

const Signup = () => {
  const [fieldStates, setFieldStates] =
    useState<FieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const setFieldStateSuccess = (
    key: keyof FieldStates,
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

  const setFieldStateValue = (key: keyof FieldStates, value: string) => {
    setFieldStates((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], value },
      }
    })
  }

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
        const error = await getUsernameError(username)

        if (!error) {
          setFieldStateSuccess("username", true)
        } else {
          setFieldStateSuccess("username", false, error)
        }

        return error
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
      setFieldStateSuccess("password", true)
    } else {
      setFieldStateSuccess("password", false, error)
    }

    return error
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
      setFieldStateSuccess("confirmPassword", true)
    } else {
      setFieldStateSuccess("confirmPassword", false, error)
    }

    return error
  }

  const usernameRegister = useMutation({
    mutationFn: async ({ username, password }: RegisterUsernameInput) => {
      return await graphQLClient.request(usernameRegisterDocument, {
        input: { username, password },
      })
    },
    onSuccess: (data) => {
      if (
        data?.registerUsername.__typename == "DuplicateUsernameError" ||
        data?.registerUsername.__typename == "RegisterUsernameInputError"
      ) {
        setError(data.registerUsername.errorMsg)
      } else {
        navigate("/")
      }
    },
  })

  const socialSignUp = async (provider: string) => {
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

  const submitEmailSignUp = async () => {
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
      setFieldStateSuccess("username", false, usernameSubmitError)
    passwordSubmitError !== fieldStates.password.errorMsg &&
      setFieldStateSuccess("password", false, passwordSubmitError)
    confPasswordSubmitError !== fieldStates.confirmPassword.errorMsg &&
      setFieldStateSuccess("confirmPassword", false, confPasswordSubmitError)

    if (usernameSubmitError || passwordSubmitError || confPasswordSubmitError) {
      return
    }

    usernameRegister.mutate({
      username: fieldStates.username.value,
      password: fieldStates.password.value,
    })

    setSubmitting(false)
  }

  const inputStyle =
    "flex justify-center items-center gap-3 border border-neutral-500 rounded-full py-2 hover:bg-neutral-100 transition-colors duration-200"

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[650px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 items-center hover:underline">
          <AiOutlineArrowLeft className="w-4 h-4" />
          <p className="text-sm">Home</p>
        </Link>

        <form className="flex flex-col w-[60%] mx-auto mt-4">
          <h1 className="text-3xl font-semibold mb-8">Sign Up</h1>
          {error && <ErrorCard error={error} className="mb-4" />}
          <div className="flex flex-col gap-5">
            <button
              type="button"
              className={inputStyle}
              onClick={() => socialSignUp("google")}
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              type="button"
              className={inputStyle}
              onClick={() => socialSignUp("github")}
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
            onChange={(e) => {
              setFieldStateValue("username", e.target.value)
              validateUsername(e.target.value)
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
              onChange={(e) => setFieldStateValue("password", e.target.value)}
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
              setFieldStateValue("confirmPassword", e.target.value)
            }
            onBlur={(e) => validateConfPassword(e.target.value)}
            error={fieldStates.confirmPassword.error}
            errorMsg={fieldStates.confirmPassword.errorMsg}
            success={fieldStates.confirmPassword.success}
          />
          <button
            type="button"
            onClick={() => submitEmailSignUp()}
            className="btn_blue py-2 mt-2 w-[60%] mx-auto disabled:bg-blue-300"
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
              className="text-blue-600 font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
