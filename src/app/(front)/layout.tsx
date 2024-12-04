import Navigation from "@/components/commons/Navigation";
import React from "react";
import * as MainStyles from "@/styles/MainStyles"

export default function FrontLayout({ children }: Readonly<{children: React.ReactNode}>) {
    return (
        <>
            <Navigation />
            {children}
        </>
    )
}