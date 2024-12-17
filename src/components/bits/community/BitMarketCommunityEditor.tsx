
import * as CS from "@/styles/BitMarketCommunityStyles";
import ModalLayout from "@/components/atomics/ModalLayout";
import { ContentInput, TitleInput } from "@/components/inputs/CommunityInputs";
import MarketCommunity from "@/types/bits/MarketCommunity";
import CommonUtils from "@/utils/CommonUtils";
import { useState } from "react";
import BitApi from "@/apis/api/bits/BitApi";
import { useRouter } from "next/navigation";

interface IBitMarketCommunityEditor {
    marketCode: string
    community: MarketCommunity
    onClose: () => void
}
export default function BitMarketCommunityEditor({ marketCode, community, onClose }: IBitMarketCommunityEditor) {
    const router = useRouter()

    const isCreate = CommonUtils.isStringNullOrEmpty(community.nanoId)
    
    const [title, setTitle] = useState<string>(community.title)
    const [content, setContent] = useState<string>(community.content)

    const handleSave = async () => {
        let data = {
            title: title,
            content: content,
        }

        if (isCreate) {
            // create
            data["market_code"] = marketCode
            create(data)
        } else {
            // update
            update(data)
        }
    }

    const create = async (data: object) => {
        const response = await BitApi.createCommunity(data)

        if (!CommonUtils.isStringNullOrEmpty(response.nanoId)) {
            alert("저장되었습니다.")
            router.replace(`/crypto/${marketCode}`)
            onClose()
        } else {
            alert("저장에 실패했습니다.")
        }
    }

    const update = async (data: object) => {
        const response = await BitApi.updateCommunity(community.nanoId, data)

        if (!CommonUtils.isStringNullOrEmpty(response.nanoId)) {
            alert("수정되었습니다.")
            router.refresh()
            onClose()
        } else {
            alert("수정에 실패했습니다.")
        }
    }

    return (
        <ModalLayout
            title={`토론 ${isCreate ? "등록" : "수정"}`}
            layoutClassName="max-sm:w-[90vw] sm:w-128"
            contentClassName="max-h-[80vh]"
        >
            <div className="flex flex-col w-full space-y-4">
                <TitleInput 
                    value={title}
                    setValue={setTitle}
                    label="제목"
                />

                <ContentInput
                    value={content}
                    setValue={setContent}
                    placeholder="내용을 입력해주세요."
                />

                <div className="flex justify-end items-center space-x-2">
                    <CS.SaveButton onClick={() => {handleSave()}}>
                        저장
                    </CS.SaveButton>
                </div>
            </div>
        </ModalLayout>
    )
}