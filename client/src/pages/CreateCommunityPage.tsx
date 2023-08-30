import { ImSpinner11 } from "react-icons/im"
import TextInput from "../components/misc/TextInput"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { graphQLClient } from "../utils/graphql"
import { useMutation } from "@tanstack/react-query"
import { CreateCommunityInput } from "../graphql_codegen/graphql"
import { debounce } from "lodash"
import { FieldState, FieldStates, initialFieldState } from "../types/shared"
import { setFieldStateSuccess, setFieldStateValue } from "../utils/form"
import { toast } from "react-toastify"
import ErrorCard from "../components/misc/ErrorCard"
import { communityTitleExistsDocument } from "../graphql/sharedDocuments"

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
    }
  }
`)

interface FormFieldStates extends FieldStates {
  title: FieldState
}

const initialFieldStates: FormFieldStates = {
  title: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  TITLE_LENGTH = "Title must be less than 25 characters long",
  TITLE_TAKEN = "Title in use",
}

const CreateCommunityPage = () => {
  const [fieldStates, setFieldStates] =
    useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [validatingTitle, setValidatingTitle] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const navigate = useNavigate()

  const createCommunity = useMutation({
    mutationFn: async ({ title }: CreateCommunityInput) => {
      return await graphQLClient.request(createCommunityDocument, {
        input: { title },
      })
    },
    onSuccess: (data) => {
      if (data.createCommunity.__typename == "CreateCommunitySuccess") {
        toast.success("Successfully created community")
        if (error) setError("")
        navigate("/")
      } else if (
        data.createCommunity.__typename == "CreateCommunityInputError"
      ) {
        setError(data.createCommunity.errorMsg)
      }
    },
  })

  const getTitleError = async (title: string) => {
    let error: string | undefined

    if (!title) {
      error = FieldErrorMsgs.REQUIRED
    } else if (title.length > 25) {
      error = FieldErrorMsgs.TITLE_LENGTH
    } else {
      const response = await graphQLClient.request(
        communityTitleExistsDocument,
        {
          title,
        }
      )

      if (response.titleExists) {
        error = FieldErrorMsgs.TITLE_TAKEN
      }
    }

    return error
  }

  const validateTitle = useCallback(
    debounce(
      async (title: string) => {
        setValidatingTitle(true)

        const error = await getTitleError(title)

        if (!error) {
          setFieldStateSuccess(setFieldStates, "title", true)
        } else {
          setFieldStateSuccess(setFieldStates, "title", false, error)
        }

        setValidatingTitle(false)
      },
      500,
      { trailing: true }
    ),
    []
  )

  const submitCreateCommunity = async () => {
    setSubmitting(true)

    if (validatingTitle) {
      return
    }

    const titleSubmitError =
      fieldStates.title.errorMsg == FieldErrorMsgs.TITLE_TAKEN
        ? FieldErrorMsgs.TITLE_TAKEN
        : !fieldStates.title.success
        ? await getTitleError(fieldStates.title.value)
        : fieldStates.title.errorMsg

    titleSubmitError !== fieldStates.title.errorMsg &&
      setFieldStateSuccess(setFieldStates, "title", false, titleSubmitError)

    if (titleSubmitError) {
      return
    }

    createCommunity.mutate({
      title: fieldStates.title.value,
    })
  }

  return (
    <div className="bg-white m-auto rounded-xl h-[300px] max-w-[550px] w-[90%] p-4 border border-neutral-300 overflow-auto">
      <div className="flex flex-col items-center xs:w-[60%] xs-max:w-[90%] mx-auto">
        <h1 className="text-2xl font-medium mb-6 xs-max:text-xl">
          Create a Community
        </h1>
        <form className="flex flex-col">
          {error && <ErrorCard error={error} className="mb-4" />}
          <label className="flex flex-col gap-2">
            <p className="text-xl xs-max:text-lg">Title</p>
            <TextInput
              name="title"
              type="text"
              value={fieldStates.title.value}
              onChange={(e) => {
                setFieldStateValue(
                  setFieldStates,
                  "title",
                  e.target.value.trim()
                )
                validateTitle(e.target.value.trim())
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  setFieldStateSuccess(
                    setFieldStates,
                    "title",
                    false,
                    FieldErrorMsgs.REQUIRED
                  )
                }
              }}
              error={fieldStates.title.error}
              errorMsg={fieldStates.title.errorMsg}
              success={fieldStates.title.success}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              submitCreateCommunity()
              setSubmitting(false)
            }}
            className="btn_blue py-1 mt-4 px-4 mx-auto"
            disabled={submitting}
          >
            {submitting ? (
              <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCommunityPage
