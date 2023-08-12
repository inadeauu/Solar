import { AiOutlineArrowLeft } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs"
import { Field, Form, Formik } from "formik"
import { useState } from "react"
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
import AwesomeDebouncePromise from "awesome-debounce-promise"

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

const Signup = () => {
  const
  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const validateUsername = AwesomeDebouncePromise(
    async (username) => {
      let error

      if (!username) {
        error = "Required"
      } else if (username.length < 5 || username.length > 15) {
        error = "Username must be 5-15 characters long"
      } else {
        const response = await graphQLClient.request(usernameExistsDocument, {
          username,
        })

        if (response.usernameExists) {
          error = "Username in use"
        }
      }

      if (!error) {
        setUsernameFieldSuccess(true)
      } else if (usernameFieldSuccess) {
        setUsernameFieldSuccess(false)
      }

      return error
    },
    500,
    { leading: false }
  )

  const validatePassword = (password: string) => {
    let error

    if (!password) {
      error = "Required"
    } else if (password.length < 8) {
      error = "Password must be at least 8 characters long"
    }

    if (!error) {
      setPasswordConfFieldSuccess(true)
    } else if (usernameFieldSuccess) {
      setPasswordConfFieldSuccess(false)
    }

    return error
  }

  const validateConfPassword = (password: string, confPassword: string) => {
    let error

    if (!confPassword) {
      error = "Required"
    } else if (password !== confPassword) {
      error = "Passwords do not match"
    }

    if (!error) {
      setPasswordConfFieldSuccess(true)
    } else if (usernameFieldSuccess) {
      setPasswordConfFieldSuccess(false)
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

  const inputStyle =
    "flex justify-center items-center gap-3 border border-neutral-500 rounded-full py-2 hover:bg-neutral-100 transition-colors duration-200"

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[650px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 items-center hover:underline">
          <AiOutlineArrowLeft className="w-4 h-4" />
          <p className="text-sm">Home</p>
        </Link>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={}
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            usernameRegister.mutate({
              username: values.username,
              password: values.password,
            })
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="flex flex-col w-[60%] mx-auto mt-4">
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

              <Field
                name="username"
                type="text"
                placeholder="Username"
                component={TextInput}
                validate={validateUsername}
              />
              <div className="relative">
                <Field
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  component={TextInput}
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
              <Field
                name="confirmPassword"
                type={showPass ? "text" : "password"}
                placeholder="Confirm Password"
                component={TextInput}
              />
              <button
                className="btn_blue py-2 mt-2 w-[60%] mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signup
