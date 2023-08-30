import Modal from "./Modal"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: (...any: any[]) => any
  onAccept: (...any: any[]) => any
  text: string
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onAccept,
  text,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <h1 className="text-xl font-medium">{text}</h1>
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => {
              onClose()
            }}
            className="btn_red py-1 px-3"
          >
            No
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept()
              onClose()
            }}
            className="btn_blue py-1 px-3"
          >
            Yes
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ConfirmationModal
