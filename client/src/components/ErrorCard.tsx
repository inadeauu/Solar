type ErrorCardProps = {
  error: string
  className: string
}

const ErrorCard = ({ error, className }: ErrorCardProps) => {
  return (
    <div
      className={`bg-red-400 text-white rounded-lg p-1 font-bold text-center text-sm ${className}`}
    >
      {error}
    </div>
  )
}

export default ErrorCard
