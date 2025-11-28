import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Copy, Star } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onToggleFavorite?: () => void;
    isFavorite?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    onClose,
    onEdit,
    onDelete,
    onDuplicate,
    onToggleFavorite,
    isFavorite
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 backdrop-blur-xl bg-nothing-base/95 border border-nothing-dark/20 rounded-lg shadow-xl overflow-hidden min-w-[160px]"
            style={{ left: x, top: y }}
        >
            <div className="py-1">
                {onEdit && (
                    <button
                        onClick={() => handleAction(onEdit)}
                        className="w-full px-4 py-2 text-left text-sm font-mono text-nothing-dark hover:bg-nothing-dark/10 flex items-center gap-3 transition-colors"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                )}
                {onDuplicate && (
                    <button
                        onClick={() => handleAction(onDuplicate)}
                        className="w-full px-4 py-2 text-left text-sm font-mono text-nothing-dark hover:bg-nothing-dark/10 flex items-center gap-3 transition-colors"
                    >
                        <Copy size={14} />
                        Duplicate
                    </button>
                )}
                {onToggleFavorite && (
                    <button
                        onClick={() => handleAction(onToggleFavorite)}
                        className="w-full px-4 py-2 text-left text-sm font-mono text-nothing-dark hover:bg-nothing-dark/10 flex items-center gap-3 transition-colors"
                    >
                        <Star size={14} className={isFavorite ? 'fill-current text-nothing-accent' : ''} />
                        {isFavorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                )}
                {(onEdit || onDuplicate || onToggleFavorite) && onDelete && (
                    <div className="my-1 border-t border-dotted border-nothing-dark/10" />
                )}
                {onDelete && (
                    <button
                        onClick={() => handleAction(onDelete)}
                        className="w-full px-4 py-2 text-left text-sm font-mono text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                )}
            </div>
        </motion.div>
    );
};
