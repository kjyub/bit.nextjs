import * as NS from "@/styles/NavigationStyles"
import Link from "next/link"

export default function BitNavigation() {
    return (
        <NS.Section>
            <Link href="/crypto" className="btn">
                <i className="fa-solid fa-chart-pie"></i>
                <span>내 거래</span>
            </Link>
            <Link href="/crypto/KRW-BTC" className="btn">
                <i className="fa-solid fa-arrow-trend-up"></i>
                <span>거래소</span>
            </Link>
        </NS.Section>
    )
}