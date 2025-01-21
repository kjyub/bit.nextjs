
import Pagination from "@/types/api/pagination"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props<T> {
    nextPage: () => void
    pageIndex: number
    itemCount: number
    pageSize: number
}
export default function usePageScroll({ nextPage, pageIndex, itemCount, pageSize }: Props<unknown>): unknown{
    const [scrollRef, scrollInView] = useInView()

    useEffect(() => {
        // 맨 위의 아이템이 보이면 업데이트
        if (scrollInView && pageIndex * pageSize < itemCount) {
            nextPage()
        }
    }, [scrollInView])

    return scrollRef
}