import { FieldProps } from "formik"

const TextInput = ({ field, form: { errors } }: FieldProps) => {
  return (
    <div
      className={`flex flex-col gap-1 ${errors[field.name] ? "mb-2" : "mb-4"}`}
    >
      <input
        className={`border-2 border-neutral-500 w-full p-1 outline-none ${
          errors[field.name]
            ? "border-red-400 hover:border-red-600 focus:border-red-600"
            : "hover:border-blue-400 focus:border-blue-400"
        }`}
        {...field}
      />
      {errors[field.name] ? (
        <p className="text-red-400 text-xs font-bold">{`${
          errors[field.name]
        }`}</p>
      ) : null}
    </div>
  )
}

export default TextInput
