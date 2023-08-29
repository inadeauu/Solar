import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import UsernameChangeModal from "./UsernameChangeModal"
import PasswordChangeModal from "./PasswordChangeModal"

const AccountSettings = () => {
  const { user } = useAuth()

  const [changeUsernameModalOpen, setChangeUsernameModalOpen] =
    useState<boolean>(false)

  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false)

  return (
    <>
      <div className="bg-white border border-neutral-300 rounded-lg p-4">
        <div className="sm:w-[80%] sm-max:w-full">
          <h1 className="text-xl font-medium mb-4">Account Settings</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-[2px]">
                <span className="text-neutral-500 font-medium text-sm">
                  Account Preferences
                </span>
                <hr className="grow" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium">Username</span>
                  <span className="text-[13px] text-neutral-500">
                    Current username: {user?.username}
                  </span>
                </div>
                <button
                  onClick={() => setChangeUsernameModalOpen((prev) => !prev)}
                  className="btn_blue py-1 px-2"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium">Password</span>
                  <span className="text-[13px] text-neutral-500">
                    Password must be at least 8 characters long
                  </span>
                </div>
                <button
                  onClick={() => setChangePasswordModalOpen((prev) => !prev)}
                  className="btn_blue py-1 px-2"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UsernameChangeModal
        isOpen={changeUsernameModalOpen}
        onClose={() => setChangeUsernameModalOpen(false)}
      />
      <PasswordChangeModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </>
  )
}

export default AccountSettings
