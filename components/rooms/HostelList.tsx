"use client";

import { motion } from "framer-motion";
import { FiPlus, FiChevronRight, FiFolder, FiTrash2 } from "react-icons/fi";
import type { Hostel } from "@/types";

interface HostelListProps {
  hostels: Hostel[];
  selectedHostel: Hostel | null;
  onSelect: (hostel: Hostel) => void;
  onAdd: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  loading: boolean;
}

export default function HostelList({
  hostels,
  selectedHostel,
  onSelect,
  onAdd,
  onDelete,
  loading,
}: HostelListProps) {
  return (
    <div className="flex flex-col h-full bg-hosteloom-surface border border-hosteloom-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-hosteloom-border flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent">
            <FiFolder className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide">Hostels</h3>
        </div>
        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-hosteloom-surface-light border border-hosteloom-border flex items-center justify-center text-white hover:bg-hosteloom-accent hover:border-hosteloom-accent transition-all group"
        >
          <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 opacity-50">
            <div className="w-5 h-5 border-2 border-hosteloom-accent border-t-transparent animate-spin rounded-full" />
            <p className="text-xs font-body tracking-wider uppercase">Loading hostels...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 opacity-50">
            <FiFolder className="w-8 h-8 text-hosteloom-muted" />
            <p className="text-xs font-body uppercase tracking-wider">No hostels created yet.</p>
          </div>
        ) : (
          hostels.map((h) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={h.id}
              onClick={() => onSelect(h)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                selectedHostel?.id === h.id
                  ? "bg-hosteloom-accent/10 border-hosteloom-accent/30 text-white"
                  : "bg-hosteloom-surface-light border-hosteloom-border hover:border-white/20 hover:bg-hosteloom-surface-light/80"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-heading font-bold text-sm">{h.name}</div>
                  <div className="text-[10px] text-hosteloom-muted mt-0.5 truncate max-w-[180px]">
                    {h.address}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onDelete(h.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-hosteloom-secondary hover:bg-hosteloom-secondary/10 rounded-lg transition-all"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <FiChevronRight
                    className={`transition-transform duration-300 ${
                      selectedHostel?.id === h.id
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
