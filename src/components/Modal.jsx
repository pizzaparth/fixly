import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`relative z-10 w-full ${maxWidth} rounded-3xl bg-white border-2 border-zinc-900 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-xl font-bold text-zinc-950 tracking-tight">{title}</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-black hover:text-white border border-zinc-300 hover:border-black cursor-pointer transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
