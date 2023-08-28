type ModalProps = {
  isOpen: boolean
  onClose: (...args: any[]) => any
  children: React.ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-[9999] ${
        !isOpen && "hidden"
      }`}
    >
      <div onClick={() => onClose()} className="flex h-full w-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className="m-auto bg-white border border-neutral-300 rounded-xl max-h-[500px] max-w-[400px] w-[90%] h-[90%] p-4"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
