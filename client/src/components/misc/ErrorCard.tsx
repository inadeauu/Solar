type ErrorCardProps = {
  error: string
  className: string
}

const ErrorCard = ({ error, className, ...rest }: ErrorCardProps) => {
  return (
    <div
      className={`bg-red-400 text-white rounded-lg p-1 font-medium text-center text-sm ${className}`}
      {...rest}
    >
      Error: {error}
    </div>
  )
}

export default ErrorCard
