import Modal from "./Modal"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: (...any: any[]) => any
  onAccept: (...any: any[]) => any
  text: string
  testid: string
}

const ConfirmationModal = ({ isOpen, onClose, onAccept, text, testid }: ConfirmationModalProps) => {
  return (
    <Modal
      testid={testid}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
    >
      <form className="flex flex-col w-[80%]">
        <h1 className="text-xl font-medium">{text}</h1>
        <div className="flex gap-4 mt-4">
          <button
            data-testid={`${testid}-no`}
            type="button"
            onClick={() => {
              onClose()
            }}
            className="btn_red py-1 px-3"
          >
            No
          </button>
          <button
            data-testid={`${testid}-yes`}
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
