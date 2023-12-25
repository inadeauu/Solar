import { Navigate, useParams } from "react-router-dom"
import { useCommunity } from "../../../graphql/useQuery"
import { ImSpinner11 } from "react-icons/im"
import { useAuth } from "../../../hooks/useAuth"
import { useState } from "react"
import CommunityTitleChangeModal from "./CommunityTitleChangeModal"
import { translator } from "../../../utils/uuid"
import DeleteCommunityModal from "./DeleteCommunityModal"

const CommunitySettings = () => {
  const { user } = useAuth()
  const { id } = useParams()

  const [changeTitleModalOpen, setChangeTitleModalOpen] = useState<boolean>(false)

  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] = useState<boolean>(false)

  const { data, isLoading } = useCommunity(translator.toUUID(id || ""))

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.community) {
    return <Navigate to="/404-not-found" />
  } else if (data.community.owner.id !== user?.id) {
    return <Navigate to="/" />
  }

  return (
    <>
      <div className="bg-white border border-neutral-300 rounded-lg p-4">
        <div className="sm:w-[80%] sm-max:w-full">
          <h1 className="text-xl font-medium mb-4">Community Settings</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-[2px]">
                <span className="text-neutral-500 font-medium text-sm">Community Preferences</span>
                <hr className="grow" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium">Title</span>
                  <span data-testid="current-community-title" className="text-[13px] text-neutral-500 break-all">
                    Current community title: {data?.community?.title}
                  </span>
                </div>
                <button
                  data-testid="change-title-button"
                  onClick={() => setChangeTitleModalOpen((prev) => !prev)}
                  className="btn_blue py-1 px-2"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-[2px]">
                <span className="text-neutral-500 font-medium text-sm">Delete Community</span>
                <hr className="grow" />
              </div>
              <button
                data-testid="delete-community-button"
                onClick={() => setDeleteCommunityModalOpen((prev) => !prev)}
                className="btn_red py-1 px-2 w-fit text-sm"
              >
                Delete Community
              </button>
            </div>
          </div>
        </div>
      </div>
      <CommunityTitleChangeModal
        isOpen={changeTitleModalOpen}
        onClose={() => setChangeTitleModalOpen(false)}
        communityId={data.community.id}
      />
      <DeleteCommunityModal
        isOpen={deleteCommunityModalOpen}
        onClose={() => setDeleteCommunityModalOpen(false)}
        communityTitle={data.community.title}
        communityId={data.community.id}
      />
    </>
  )
}

export default CommunitySettings
