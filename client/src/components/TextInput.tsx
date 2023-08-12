import { FieldInputProps, FormikProps } from "formik"
import { FaCheck } from "react-icons/fa"
import { ImCross } from "react-icons/im"

type TextInputProps = {
  field: FieldInputProps<any>
  form: FormikProps<any>
  useTouched?: boolean
  useSuccess?: boolean
  [x: string]: any
}

const TextInput = ({
  field,
  form: { values, errors, touched },
  useTouched = true,
  useSuccess = false,
  ...props
}: TextInputProps) => {
  const errorStatus = useTouched
    ? errors[field.name] && touched[field.name]
    : errors[field.name]

  const successStatus = useTouched
    ? useSuccess && touched[field.name]
    : useSuccess && values[field.name] && !errors[field.name]

  return (
    <div className={`flex flex-col gap-1 ${errorStatus ? "mb-2" : "mb-4"}`}>
      <div className="relative">
        <input
          className={`rounded-lg border-2 border-neutral-500 w-full px-2 py-1 outline-none transition-all duration-200 peer ${
            errorStatus
              ? "border-red-400 hover:border-red-600 focus:border-red-600"
              : successStatus
              ? "border-green-400 hover:border-green-600 focus:border-green-600"
              : "hover:border-blue-400 focus:border-blue-400"
          }`}
          {...field}
          {...props}
        />
        <FaCheck
          className={`h-6 w-6 text-green-400 absolute right-0 top-[6px] transition-all duration-200 opacity-0 pointer-events-none peer-hover:text-green-600 peer-focus:text-green-600 ${
            successStatus && "opacity-100 right-2"
          }`}
        />
        <ImCross
          className={`h-5 w-5 text-red-400 absolute right-0 top-[8px] transition-all duration-200 opacity-0 pointer-events-none peer-hover:text-red-600 peer-focus:text-red-600 ${
            errorStatus && "opacity-100 right-2"
          }`}
        />
      </div>
      {errorStatus ? (
        <p className="text-red-400 text-xs font-bold">{`${
          errors[field.name]
        }`}</p>
      ) : null}
    </div>
  )
}

export default TextInput
