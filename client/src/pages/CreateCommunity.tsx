import { Field, Form, Formik } from "formik"
import { ImSpinner11 } from "react-icons/im"
import ErrorCard from "../components/ErrorCard"
import TextInput from "../components/TextInput"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { graphql } from "../gql"
import { graphQLClient } from "../utils/graphql"
import { useMutation } from "@tanstack/react-query"
import { CreateCommunityInput } from "../gql/graphql"
import AwesomeDebouncePromise from "awesome-debounce-promise"

const communityTitleExistsDocument = graphql(/* GraphQL */ `
  query CommunityTitleExists($title: String!) {
    titleExists(title: $title)
  }
`)

const createCommunityDocument = graphql(/* GraphQL */ `
  mutation CreateCommunity($input: CreateCommunityInput!) {
    createCommunity(input: $input) {
      ... on CreateCommunitySuccess {
        __typename
        successMsg
        code
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
      ... on CreateCommunityInputError {
        inputErrors {
          title
        }
      }
    }
  }
`)

const CreateCommunity = () => {
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const emailRegister = useMutation({
    mutationFn: async ({ title }: CreateCommunityInput) => {
      return await graphQLClient.request(createCommunityDocument, {
        input: { title },
      })
    },
    onSuccess: (data) => {
      if (data.createCommunity.__typename == "CreateCommunityInputError") {
        setError(data.createCommunity.errorMsg)
      } else if (data.createCommunity.__typename == "CreateCommunitySuccess") {
        navigate("/")
      }
    },
  })

  const validateTitle = AwesomeDebouncePromise(
    async (title) => {
      console.log(title)
      let error

      if (!title) {
        error = "Required"
      } else {
        const response = await graphQLClient.request(
          communityTitleExistsDocument,
          {
            title,
          }
        )

        if (response.titleExists) {
          error = "Title in use"
        }
      }
      return error
    },
    400,
    { leading: true }
  )

  return (
    <div className="bg-white m-auto rounded-xl h-[300px] max-w-[550px] w-[90%] p-4 border-2 border-black">
      <Formik
        initialValues={{ title: "" }}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          emailRegister.mutate({ title: values.title })
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <div className="w-fit mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create a Community</h1>
            <Form className="flex flex-col">
              {error && <ErrorCard error={error} className="mb-4" />}
              <label className="flex flex-col gap-2">
                <p className="text-xl">Title</p>
                <Field
                  name="title"
                  validate={validateTitle}
                  component={TextInput}
                  useTouched={false}
                />
              </label>
              <button
                className="btn_blue py-2 mt-6 w-[60%] mx-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" />
                ) : (
                  "Submit"
                )}
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default CreateCommunity
