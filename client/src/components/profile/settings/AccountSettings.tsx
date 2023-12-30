import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import UsernameChangeModal from "./UsernameChangeModal"
import PasswordChangeModal from "./PasswordChangeModal"
import DeleteAccountModal from "./DeleteAccountModal"

const AccountSettings = () => {
  const { user } = useAuth()

  const [usernameModalOpen, setUsernameModalOpen] = useState<boolean>(false)

  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false)

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState<boolean>(false)

  return (
    <>
      <div className="bg-white border border-neutral-300 rounded-lg p-4">
        <div className="sm:w-[80%] sm-max:w-full">
          <h1 className="text-xl font-medium mb-4">Account Settings</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-[2px]">
                <span className="text-neutral-500 font-medium text-sm">Account Preferences</span>
                <hr className="grow" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium">Username</span>
                  <span data-testid="settings-current-username" className="text-[13px] text-neutral-500 break-all">
                    Current username: {user?.username}
                  </span>
                </div>
                <button
                  data-testid="change-username-button"
                  onClick={() => setUsernameModalOpen((prev) => !prev)}
                  className="btn_blue py-1 px-2"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium">Password</span>
                  <span className="text-[13px] text-neutral-500">Password must be at least 8 characters long</span>
                </div>
                <button
                  data-testid="change-password-button"
                  onClick={() => setPasswordModalOpen((prev) => !prev)}
                  className="btn_blue py-1 px-2"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-[2px]">
                <span className="text-neutral-500 font-medium text-sm">Delete Account</span>
                <hr className="grow" />
              </div>
              <button
                data-testid="delete-account-button"
                onClick={() => setDeleteAccountModalOpen((prev) => !prev)}
                className="btn_red py-1 px-2 w-fit text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <UsernameChangeModal isOpen={usernameModalOpen} onClose={() => setUsernameModalOpen(false)} />
      <PasswordChangeModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      <DeleteAccountModal isOpen={deleteAccountModalOpen} onClose={() => setDeleteAccountModalOpen(false)} />
    </>
  )
}

export default AccountSettings
