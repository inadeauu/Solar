import {
  AiOutlineArrowLeft,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs"
import { Field, Form, Formik } from "formik"
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
import { LoginEmailInput } from "../gql/graphql"
import TextInput from "../components/TextInput"

const emailLoginDocument = graphql(/* GraphQL */ `
  mutation EmailLogin($input: LoginEmailInput!) {
    loginEmail(input: $input) {
      ... on LoginEmailSuccess {
        __typename
        successMsg
        code
      }
      ... on LoginEmailInputError {
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

  const emailSignIn = useMutation({
    mutationFn: async ({ email, password }: LoginEmailInput) => {
      return graphQLClient.request(emailLoginDocument, {
        input: { email, password },
      })
    },
    onSuccess: (data) => {
      if (data.loginEmail.__typename == "LoginEmailInputError") {
        setError(data.loginEmail.errorMsg)
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] })
        navigate("/")
      }
    },
  })

  const inputStyle =
    "flex justify-center items-center gap-3 border-2 border-neutral-500 rounded-full py-2 font-semibold hover:bg-neutral-100 transition-colors duration-200"

  return (
    <div className="flex h-screen">
      <div className="bg-white m-auto rounded-xl max-h-[550px] max-w-[550px] w-[90%] h-[90%] p-4 overflow-scroll border-2 border-black">
        <Link to="/" className="flex gap-2 items-center">
          <AiOutlineArrowLeft className="w-4 h-4" />
          <p className="text-sm">Home</p>
        </Link>
        <Formik
          validateOnChange={false}
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            emailSignIn.mutate({
              email: values.email,
              password: values.password,
            })
            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-[60%] mx-auto mt-4">
              <h1 className="text-3xl font-bold mb-8">Login</h1>
              {error && <ErrorCard error={error} className="mb-4" />}
              <div className="flex flex-col gap-5">
                <button
                  type="button"
                  className={inputStyle}
                  onClick={() => socialSignIn("google")}
                >
                  <FcGoogle className="h-5 w-5" />
                  Sign in with Google
                </button>
                <button
                  type="button"
                  className={inputStyle}
                  onClick={() => socialSignIn("github")}
                >
                  <BsGithub className="h-5 w-5" />
                  Sign in with Github
                </button>
              </div>

              <div className="flex my-3 items-center">
                <hr className="grow h-[2px] bg-black" />
                <div className="rounded-full p-3 border-2 border-black relative">
                  <p className="absolute translate-x-[-50%] translate-y-[-50%] text-sm">
                    or
                  </p>
                </div>
                <hr className="grow h-[2px] bg-black" />
              </div>

              <Field
                name="email"
                type="email"
                placeholder="Email"
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
                  className="absolute top-0 right-0 translate-x-[115%] translate-y-[15%]"
                  onClick={() => setShowPass((prev) => !prev)}
                >
                  {showPass ? (
                    <AiOutlineEye className="w-7 h-7 leading-[1px]" />
                  ) : (
                    <AiOutlineEyeInvisible className="w-7 h-7" />
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
                  "Login"
                )}
              </button>
              <p className="text-xs mt-4">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 font-bold hover:text-blue-300"
                >
                  Sign up
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
