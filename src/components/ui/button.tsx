import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg",
                primary: "bg-accent/80 backdrop-blur-md border border-accent/40 text-white hover:bg-accent hover:shadow-[0_0_30px_rgba(45,139,122,0.4)]",
                outline: "bg-transparent backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50",
                ghost: "bg-transparent hover:bg-white/10 text-white",
                link: "text-white underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-full",
                sm: "h-9 px-4 rounded-full",
                lg: "h-12 px-8 rounded-full text-base",
                xl: "h-14 px-10 rounded-full text-lg",
                icon: "h-10 w-10 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }
