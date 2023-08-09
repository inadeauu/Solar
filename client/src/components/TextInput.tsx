import { FieldInputProps, FormikProps } from "formik"

type TextInputProps = {
  field: FieldInputProps<any>
  form: FormikProps<any>
  useTouched?: boolean
  [x: string]: any
}

const TextInput = ({
  field,
  form: { errors, touched },
  useTouched = true,
  ...props
}: TextInputProps) => {
  const errorStatus = useTouched
    ? errors[field.name] && touched[field.name]
    : errors[field.name]

  return (
    <div className={`flex flex-col gap-1 ${errorStatus ? "mb-2" : "mb-4"}`}>
      <input
        className={`border-2 border-neutral-500 w-full p-1 outline-none ${
          errorStatus
            ? "border-red-400 hover:border-red-600 focus:border-red-600"
            : "hover:border-blue-400 focus:border-blue-400"
        }`}
        {...field}
        {...props}
      />
      {errorStatus ? (
        <p className="text-red-400 text-xs font-bold">{`${
          errors[field.name]
        }`}</p>
      ) : null}
    </div>
  )
}

export default TextInput
