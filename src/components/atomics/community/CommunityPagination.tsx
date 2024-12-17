import { StyleProps } from "@/types/StyleTypes"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import tw from "tailwind-styled-components"

const PaginationBox = tw.div`
    flex items-center h-[52px] space-x-2
`
const PaginationButton = tw.button<StyleProps>`
    w-6 h-6
    ${({ $is_active }) => $is_active ? "text-blue-500" : "text-slate-400 hover:text-slate-100"}
    ${({ $is_focus }) => $is_focus ? "animation-pulse" : ""}
    transition-colors
`

interface IPagination {
    page: number
    setPage: (pageIndex: number) => void
    itemCount: number
    pageSize: number
    maxPageButtons: number
}
export default function CommunityPagination({
    page,
    setPage,
    itemCount,
    pageSize,
    maxPageButtons=5,
}: IPagination) {
    const [tempPageIndex, setTempPageIndex] = useState<number>(page)

    const [pageIndexes, setPageIndexes] = useState<Array<number>>([])
    const [pageCount, setPageCount] = useState<number>(0)

    const [previousPage, setPreviousPage] = useState<number>(0)
    const [nextPage, setNextPage] = useState<number>(0)

    useEffect(() => {
        // eslint-disable-next-line prefer-const
        let indexes = []

        const _pageCount = Math.ceil(itemCount / pageSize)
        setPageCount(_pageCount)

        const first = (Math.ceil(page / maxPageButtons) - 1) * maxPageButtons + 1
        for (let i = first; i < first + maxPageButtons; i++) {
            indexes.push(i)

            if (i === _pageCount) {
                break
            }
        }

        setPageIndexes(indexes)
        setTempPageIndex(page)
        setPreviousPage(indexes[0] - 1)
        setNextPage(indexes[indexes.length - 1] + 1)
    }, [page, itemCount, pageSize])

    const handlePage = (index) => {
        setTempPageIndex(index)
        setPage(index)
    }

    return (
        <>
            {pageCount <= 1 ? (
                <></>
            ) : (
                <PaginationBox>
                    {page > maxPageButtons && (
                        <PaginationButton
                            onClick={() => {
                                handlePage(previousPage)
                            }}
                            $is_focus={previousPage === tempPageIndex && tempPageIndex !== page}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </PaginationButton>
                    )}
                    {pageIndexes.map((pageIndex) => {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <PaginationButton
                                key={pageIndex}
                                onClick={() => {
                                    handlePage(pageIndex)
                                }}
                                $is_active={pageIndex === page}
                                $is_focus={pageIndex === tempPageIndex && tempPageIndex !== page}
                            >
                                {pageIndex}
                            </PaginationButton>
                        )
                    })}
                    {page <= Math.floor(pageCount / maxPageButtons) * maxPageButtons && pageCount > maxPageButtons && (
                        <PaginationButton
                            onClick={() => {
                                handlePage(nextPage)
                            }}
                            $is_focus={nextPage === tempPageIndex && tempPageIndex !== page}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </PaginationButton>
                    )}
                </PaginationBox>
            )}
        </>
    )
}
