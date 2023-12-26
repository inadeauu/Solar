import { useCallback, useState } from "react"
import Modal from "../../misc/Modal"
import TextInput from "../../misc/TextInput"
import { ImSpinner11 } from "react-icons/im"
import { FieldState, FieldStates, initialFieldState } from "../../../types/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../../../utils/graphql"
import { debounce } from "lodash"
import { setFieldStateSuccess, setFieldStateValue } from "../../../utils/form"
import { toast } from "react-toastify"
import { communityTitleExistsDocument } from "../../../graphql/sharedDocuments"
import { graphql } from "../../../graphql_codegen/gql"
import { ChangeCommunityTitleInput, CommunityQuery } from "../../../graphql_codegen/graphql"
import ErrorCard from "../../misc/ErrorCard"

const changeCommunityTitleDocument = graphql(/* GraphQL */ `
  mutation ChangeCommunityTitle($input: ChangeCommunityTitleInput!) {
    changeCommunityTitle(input: $input) {
      ... on ChangeCommunityTitleSuccess {
        __typename
        successMsg
        code
        community {
          id
          memberCount
          postCount
          inCommunity
          owner {
            id
            username
          }
          title
          created_at
          updated_at
        }
      }
      ... on ChangeCommunityTitleInputError {
        __typename
        errorMsg
        code
        inputErrors {
          newTitle
        }
      }
    }
  }
`)

type CommunityTitleChangeModalProps = {
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
  TITLE_LENGTH = "Title must be less than 25 characters long",
  TITLE_TAKEN = "Title in use",
}

const CommunityTitleChangeModal = ({ communityId, isOpen, onClose }: CommunityTitleChangeModalProps) => {
  const [fieldStates, setFieldStates] = useState<FormFieldStates>(initialFieldStates)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [validatingTitle, setValidatingTitle] = useState<boolean>(false)

  const [error, setError] = useState("")
  const queryClient = useQueryClient()

  const editCommunityTitle = useMutation({
    mutationFn: async ({ id, newTitle }: ChangeCommunityTitleInput) => {
      return await graphQLClient.request(changeCommunityTitleDocument, {
        input: { id, newTitle },
      })
    },
    onSuccess: (data) => {
      if (data.changeCommunityTitle.__typename == "ChangeCommunityTitleSuccess") {
        const updatedCommunity = data.changeCommunityTitle.community
        fieldStates.title = initialFieldState
        queryClient.setQueryData<CommunityQuery>(["community", updatedCommunity.id], (oldData) => {
          return oldData
            ? {
                ...oldData,
                community: updatedCommunity,
              }
            : oldData
        })
        toast.success("Successfully changed title")
        setError("")
        onClose()
      } else if (data.changeCommunityTitle.__typename == "ChangeCommunityTitleInputError") {
        setError(data.changeCommunityTitle.errorMsg)
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
      const response = await graphQLClient.request(communityTitleExistsDocument, {
        title,
      })

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

  const submitEditCommunityTitle = async () => {
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

    editCommunityTitle.mutate({
      id: communityId,
      newTitle: fieldStates.title.value,
    })
  }

  return (
    <Modal
      testid="change-community-title-modal"
      isOpen={isOpen}
      onClose={() => {
        fieldStates.title = initialFieldState
        setError("")
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <h1 className="text-xl font-medium mb-4">Change Community Title</h1>
        {error && <ErrorCard data-testid="change-community-title-error" error={error} className="mb-4" />}
        <div className="flex flex-col">
          <TextInput
            name="new-title"
            type="text"
            placeholder="New Title"
            value={fieldStates.title.value}
            onChange={(e) => {
              setFieldStateValue(setFieldStates, "title", e.target.value.trim())
              validateTitle(e.target.value.trim())
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                setFieldStateSuccess(setFieldStates, "title", false, FieldErrorMsgs.REQUIRED)
              }
            }}
            error={fieldStates.title.error}
            errorMsg={fieldStates.title.errorMsg}
            success={fieldStates.title.success}
          />
        </div>
        <button
          data-testid="change-title-modal-submit"
          type="button"
          onClick={() => {
            submitEditCommunityTitle()
            setSubmitting(false)
          }}
          className="btn_blue py-1 px-2 mt-2 self-end text-sm disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? <ImSpinner11 className="animate-spin h-6 w-6 mx-auto" /> : "Submit"}
        </button>
      </form>
    </Modal>
  )
}

export default CommunityTitleChangeModal
