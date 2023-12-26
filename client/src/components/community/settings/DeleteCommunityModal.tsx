import { useState } from "react"
import Modal from "../../misc/Modal"
import TextInput from "../../misc/TextInput"
import { ImSpinner11 } from "react-icons/im"
import { FieldState, FieldStates, initialFieldState } from "../../../types/shared"
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../../../utils/graphql"
import { setFieldStateSuccess, setFieldStateValue } from "../../../utils/form"
import { toast } from "react-toastify"
import { graphql } from "../../../graphql_codegen/gql"
import { DeleteCommunityInput } from "../../../graphql_codegen/graphql"
import { useNavigate } from "react-router-dom"
import ErrorCard from "../../misc/ErrorCard"

const deleteCommunityDocument = graphql(/* GraphQL */ `
  mutation DeleteCommunity($input: DeleteCommunityInput!) {
    deleteCommunity(input: $input) {
      ... on DeleteCommunitySuccess {
        __typename
        successMsg
        code
      }
      ... on DeleteCommunityInputError {
        __typename
        errorMsg
        code
        inputErrors {
          title
        }
      }
    }
  }
`)

type DeleteCommunityModalProps = {
  communityTitle: string
  communityId: string
  isOpen: boolean
  onClose: (...any: any[]) => any
}

interface FormFieldStates extends FieldStates {
  title: FieldState
}

const initialFieldStates: FormFieldStates = {
  title: initialFieldState,
}

enum FieldErrorMsgs {
  REQUIRED = "Required",
  TITLE_MATCH = "Please enter your community's title",
}

const DeleteCommunityModal = ({ communityId, communityTitle, isOpen, onClose }: DeleteCommunityModalProps) => {
  const [fieldStates, setFieldStates] = useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [error, setError] = useState("")
  const navigate = useNavigate()

  const deleteCommunity = useMutation({
    mutationFn: async ({ id, title }: DeleteCommunityInput) => {
      return await graphQLClient.request(deleteCommunityDocument, {
        input: { id, title },
      })
    },
    onSuccess: (data) => {
      if (data.deleteCommunity.__typename == "DeleteCommunitySuccess") {
        fieldStates.title = initialFieldState
        toast.success("Successfully deleted community")
        onClose()
        setError("")
        navigate("/")
      } else if (data.deleteCommunity.__typename == "DeleteCommunityInputError") {
        setError(data.deleteCommunity.errorMsg)
      }
    },
  })

  const getTitleError = (title: string) => {
    let error: string | undefined

    if (!title) {
      error = FieldErrorMsgs.REQUIRED
    } else if (title !== communityTitle) {
      error = FieldErrorMsgs.TITLE_MATCH
    }

    return error
  }

  const validateTitle = (title: string) => {
    const error = getTitleError(title)

    if (!error) {
      setFieldStateSuccess(setFieldStates, "title", true)
    } else {
      setFieldStateSuccess(setFieldStates, "title", false, error)
    }
  }

  const submitEditCommunityTitle = async () => {
    setSubmitting(true)

    const titleSubmitError = !fieldStates.title.success
      ? getTitleError(fieldStates.title.value)
      : fieldStates.title.errorMsg

    titleSubmitError !== fieldStates.title.errorMsg &&
      setFieldStateSuccess(setFieldStates, "title", false, titleSubmitError)

    if (titleSubmitError) {
      return
    }

    deleteCommunity.mutate({
      id: communityId,
      title: communityTitle,
    })
  }

  return (
    <Modal
      testid="delete-community-modal"
      isOpen={isOpen}
      onClose={() => {
        fieldStates.title = initialFieldState
        setError("")
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-medium">Delete Community</h1>
          {error && <ErrorCard data-testid="delete-community-error" error={error} className="mb-4" />}
          <p className="text-sm">This will delete everything, including all of your community's posts and comments.</p>
        </div>
        <div className="flex flex-col">
          <TextInput
            name="delete-title"
            type="text"
            placeholder="Title"
            value={fieldStates.title.value}
            onChange={(e) => {
              setFieldStateValue(setFieldStates, "title", e.target.value.trim())
            }}
            onBlur={(e) => {
              validateTitle(e.target.value)
            }}
            error={fieldStates.title.error}
            errorMsg={fieldStates.title.errorMsg}
            success={fieldStates.title.success}
          />
        </div>
        <button
          data-testid="submit-delete-community"
          type="button"
          onClick={() => {
            submitEditCommunityTitle()
            setSubmitting(false)
          }}
          className="btn_red py-1 px-2 mt-2 self-end text-sm"
          disabled={submitting}
        >
          {submitting ? <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" /> : "Delete"}
        </button>
      </form>
    </Modal>
  )
}

export default DeleteCommunityModal
