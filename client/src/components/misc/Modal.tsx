import { AiOutlineClose } from "react-icons/ai"

type ModalProps = {
  isOpen: boolean
  onClose: (...args: any[]) => any
  children: React.ReactNode
  testid: string
}

const Modal = ({ isOpen, onClose, children, testid }: ModalProps) => {
  return (
    <div
      data-testid={testid}
      className={`fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-[9999] ${!isOpen && "hidden"}`}
    >
      <div data-testid={`${testid}-outside`} onClick={() => onClose()} className="flex h-full w-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className="m-auto bg-white border border-neutral-300 rounded-xl max-h-fit max-w-[400px] w-[90%] h-[90%] overflow-scroll"
        >
          <div className="flex flex-col items-center min-w-[320px] p-4">
            <AiOutlineClose
              data-testid={`${testid}-close-button`}
              className="self-end h-5 w-5 hover:cursor-pointer"
              onClick={() => onClose()}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
