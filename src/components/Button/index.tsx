import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isSelected?: boolean;
}

export function Button({ isSelected = false, ...props }: ButtonProps) {
    return (
        <button className={`${isSelected}`} {...props}>{props.children}</button>
    )
}