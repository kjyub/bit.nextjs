"use client"
import { TOAST_MESSAGE_ANIMATION_DURATION, TOAST_MESSAGE_DURATION, TOAST_MESSAGE_MARGIN } from '@/constants/ToastConsts';
import useToastMessageStore, { ToastMessage } from '@/store/useToastMessageStore';
import { cn } from '@/utils/StyleUtils';
import React, { useState, useEffect } from 'react';

const ToastPopup = () => {
    const messages = useToastMessageStore((state) => state.messages);

    return (
        <div className="fixed top-14 left-0 z-50 flex justify-center w-screen pt-3">
            <div className="relative flex flex-col items-center max-w-[70vw] w-full">
                {messages.map((message: ToastMessage, key: number) => (
                    <Message key={message.key} index={key} message={message} />
                ))}
            </div>
        </div>
    );
};
export default ToastPopup;

const Message = ({ index, message }: {index: number, message: ToastMessage}) => {
    const deleteMessage = useToastMessageStore((state) => state.deleteMessage);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [isHide, setIsHide] = useState<boolean>(false);

    const top = index * (36 + TOAST_MESSAGE_MARGIN);

    useEffect(() => {
        setTimeout(() => {
            setIsShow(true);
        }, 50);
        setTimeout(() => {
            setIsHide(true);
        }, TOAST_MESSAGE_DURATION);
        setTimeout(() => {
            deleteMessage(message.key);
        }, TOAST_MESSAGE_DURATION + TOAST_MESSAGE_ANIMATION_DURATION);
    }, [])

    const handleClose = () => {
        setIsHide(true);
        setTimeout(() => {
            deleteMessage(message.key);
        }, TOAST_MESSAGE_ANIMATION_DURATION);
    }

    return (
        <div 
            className={cn([
                "absolute z-50 flex flex-center h-9 px-4 space-x-3",
                `top-[${top}px]`,
                "rounded-full bg-slate-600/30 backdrop-blur-sm",
                "border border-slate-200/10",
                "text-slate-100/90",
                `duration-[${TOAST_MESSAGE_ANIMATION_DURATION}ms]`,
                { "-translate-y-10 opacity-0": !isShow },
                { "translate-y-0 opacity-100": isShow },
                { "opacity-100": !isHide },
                { "opacity-0 translate-x-36": isHide },
            ])}
        >
            <div className="">
                {message.content}
            </div>
            <button 
                className="text-slate-500 hover:text-slate-300 transition-colors"
                onClick={handleClose}
            >
                <i className="fa-solid fa-xmark" />
            </button>
        </div>
    )
}