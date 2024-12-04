import react, { useState, useEffect, useRef } from "react"

export const useDetectClose = (): [
    React.MutableRefObject<HTMLElement | null>,
    boolean,
] => {
    const ref = useRef<HTMLElement | null>(null)

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const pageClickEvent = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(!isOpen)
            }
        }

        let eventElement = window
        
        // Portal 모달 내에서 사용되는 경우 클릭 이벤트 타겟을 window로 잡을 수 없다.
        try {
            const isPortalModalElement = ref.current.closest(".ReactModalPortal")
            if (isPortalModalElement) {
                // PortalModal인 경우
                eventElement = isPortalModalElement
            }
        } catch {
            //
        }

        if (isOpen) {
            eventElement.addEventListener("click", pageClickEvent)
        }

        return () => {
            eventElement.removeEventListener("click", pageClickEvent)
        }
    }, [isOpen, ref])

    return [ref, isOpen, setIsOpen]
}
