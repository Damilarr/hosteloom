"use client";

import { motion } from "framer-motion";
import { FiPlus, FiChevronRight, FiBox, FiTrash2 } from "react-icons/fi";
import type { Block } from "@/types";

interface BlockListProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onSelect: (block: Block) => void;
  onAdd: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  loading: boolean;
  disabled: boolean;
}

export default function BlockList({
  blocks,
  selectedBlock,
  onSelect,
  onAdd,
  onDelete,
  loading,
  disabled,
}: BlockListProps) {
  return (
    <div
      className={`flex flex-col h-full bg-hosteloom-surface border border-hosteloom-border rounded-2xl overflow-hidden transition-all duration-500 ${
        disabled ? "opacity-40 grayscale pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="p-5 border-b border-hosteloom-border flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent">
            <FiBox className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide">Blocks</h3>
        </div>
        {!disabled && (
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-hosteloom-surface-light border border-hosteloom-border flex items-center justify-center text-white hover:bg-hosteloom-accent hover:border-hosteloom-accent transition-all group"
          >
            <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {disabled ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 opacity-50">
            <p className="text-[10px] font-heading uppercase tracking-widest">Select a hostel first</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 opacity-50">
            <div className="w-5 h-5 border-2 border-hosteloom-accent border-t-transparent animate-spin rounded-full" />
            <p className="text-xs font-body tracking-wider uppercase">Loading blocks...</p>
          </div>
        ) : blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 opacity-50">
            <p className="text-xs font-body uppercase tracking-wider px-6">No blocks in this hostel.</p>
          </div>
        ) : (
          blocks.map((b) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={b.id}
              onClick={() => onSelect(b)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                selectedBlock?.id === b.id
                  ? "bg-hosteloom-accent/10 border-hosteloom-accent/30 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]"
                  : "bg-hosteloom-surface-light border-hosteloom-border hover:border-white/20 hover:bg-hosteloom-surface-light/80"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-sm">{b.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onDelete(b.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-hosteloom-secondary hover:bg-hosteloom-secondary/10 rounded-lg transition-all"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <FiChevronRight
                    className={`transition-transform duration-300 ${
                      selectedBlock?.id === b.id
                        ? "translate-x-1 text-hosteloom-accent"
                        : "opacity-20 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
