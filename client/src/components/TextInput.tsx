import { useField } from "formik"

type InputProps = {
  [x: string]: any
}

const TextInput = ({ ...props }: InputProps) => {
  const [field, meta] = useField(props.name)

  return (
    <div
      className={`flex flex-col gap-1 ${
        meta.touched && meta.error ? "mb-2" : "mb-4"
      }`}
    >
      <input
        className={`border-2 border-neutral-500 w-full p-1 outline-none ${
          meta.touched && meta.error
            ? "border-red-400 hover:border-red-600 focus:border-red-600"
            : "hover:border-blue-400 focus:border-blue-400"
        }`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-400 text-xs font-bold">{meta.error}</div>
      ) : null}
    </div>
  )
}

export default TextInput
