import { Form, Formik } from "formik"
import { ImSpinner11 } from "react-icons/im"
import ErrorCard from "../components/ErrorCard"
import * as Yup from "yup"
import TextInput from "../components/TextInput"
import { useState } from "react"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/axios"

const CreateCommunity = () => {
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const submit = async (title: string) => {
    try {
      await api.post("/community", { title })
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.error.message)
      }
    }
  }

  return (
    <div className="bg-white m-auto rounded-xl h-[300px] max-w-[550px] w-[90%] p-4 border-2 border-black">
      <Formik
        validateOnChange={false}
        initialValues={{ title: "" }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          submit(values.title)
          setSubmitting(false)
          navigate("/")
        }}
      >
        {({ isSubmitting }) => (
          <div className="w-fit mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create a Community</h1>
            <Form className="flex flex-col">
              {error && <ErrorCard error={error} className="mb-4" />}
              <label className="flex flex-col gap-2">
                <p className="text-xl">Title</p>
                <TextInput name="title" />
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
