import * as React from "react"
import { motion, Variants } from "framer-motion"
import { cn } from "../../lib/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
    className?: string
    items: {
        icon: LucideIcon
        label: string
        onClick?: () => void
        isActive?: boolean
    }[]
}

interface DockIconButtonProps {
    icon: LucideIcon
    label: string
    onClick?: () => void
    className?: string
    isActive?: boolean
}

const floatingAnimation: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-2, 2, -2],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
    ({ icon: Icon, label, onClick, className, isActive }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className={cn(
                    "relative group p-3 rounded-2xl",
                    "transition-colors duration-300",
                    isActive ? "bg-nothing-dark/10" : "hover:bg-nothing-dark/5",
                    className
                )}
            >
                <Icon
                    className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isActive ? "text-nothing-accent" : "text-nothing-dark/80 group-hover:text-nothing-dark"
                    )}
                />
                <span className={cn(
                    "absolute -top-10 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    "bg-nothing-surface/90 text-nothing-base border border-nothing-dark/10 backdrop-blur-md",
                    "opacity-0 group-hover:opacity-100",
                    "transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none"
                )}>
                    {label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-nothing-accent"
                    />
                )}
            </motion.button>
        )
    }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    ({ items, className }, ref) => {
        return (
            <div ref={ref} className={cn("flex items-center justify-center", className)}>
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={floatingAnimation}
                    className={cn(
                        "flex items-center gap-1 p-2 rounded-full",
                        "backdrop-blur-xl border shadow-2xl",
                        "bg-nothing-base/40 border-white/10 ring-1 ring-white/5",
                        "hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-shadow duration-300"
                    )}
                >
                    {items.map((item) => (
                        <DockIconButton key={item.label} {...item} />
                    ))}
                </motion.div>
            </div>
        )
    }
)
Dock.displayName = "Dock"

export { Dock }
