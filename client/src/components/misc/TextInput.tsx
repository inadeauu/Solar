import { FaCheck } from "react-icons/fa"
import { ImCross } from "react-icons/im"

type TextInputProps = {
  error?: boolean
  errorMsg?: string
  success?: boolean
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const TextInput = ({ error, success, errorMsg, ...rest }: TextInputProps) => {
  return (
    <div className={`flex flex-col gap-1 ${error ? "mb-2" : "mb-4"}`}>
      <div className="relative">
        <input
          className={`rounded-lg border w-full pl-2 pr-8 py-1 outline-none transition-all duration-200 peer placeholder:font-light ${
            error
              ? "border-red-400 hover:border-red-600 focus:border-red-600"
              : success
              ? "border-green-500 hover:border-green-600 focus:border-green-600"
              : "border-neutral-500 hover:border-blue-400 focus:border-blue-400"
          }`}
          {...rest}
        />
        <FaCheck
          className={`h-5 w-5 text-green-500 absolute right-0 top-[8px] transition-all duration-200 opacity-0 pointer-events-none peer-hover:text-green-600 peer-focus:text-green-600 ${
            success && "opacity-100 right-2"
          }`}
        />
        <ImCross
          className={`h-4 w-4 text-red-400 absolute right-0 top-[10px] transition-all duration-200 opacity-0 pointer-events-none peer-hover:text-red-600 peer-focus:text-red-600 ${
            error && "opacity-100 right-2"
          }`}
        />
      </div>
      {error ? (
        <p className="text-red-400 text-xs font-medium">{errorMsg}</p>
      ) : null}
    </div>
  )
}

export default TextInput
