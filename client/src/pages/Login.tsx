import { AiOutlineArrowLeft } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs"
import * as Yup from "yup"
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

const Login = () => {
  const [showPass, setShowPass] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const inputStyle =
    "flex justify-center items-center gap-3 border border-neutral-500 rounded-full py-2 hover:bg-neutral-100 transition-colors duration-200"

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[550px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border border-black">
        <Link to="/" className="flex gap-2 items-center hover:underline">
          <AiOutlineArrowLeft className="w-4 h-4" />
          <p className="text-sm">Home</p>
        </Link>
        <Formik
          validateOnChange={false}
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object({
            username: Yup.string().required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            usernameSignIn.mutate({
              username: values.username,
              password: values.password,
            })
            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-[60%] mx-auto mt-4">
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

              <Field
                name="username"
                type="text"
                placeholder="Username"
                component={TextInput}
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

              <button
                className="btn_blue py-2 mt-2 w-[60%] mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login
