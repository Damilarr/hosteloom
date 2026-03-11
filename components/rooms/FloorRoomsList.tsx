"use client";

import { motion } from "framer-motion";
import { FiPlus, FiChevronRight, FiLayers, FiTrash2, FiGrid, FiUser, FiCopy } from "react-icons/fi";
import type { Floor, Room } from "@/types";

interface FloorRoomsListProps {
  floors: Floor[];
  selectedFloor: Floor | null;
  onSelectFloor: (floor: Floor) => void;
  onAddFloor: () => void;
  onDeleteFloor: (id: string, e: React.MouseEvent) => void;
  onAddRoom: () => void;
  onBulkAddRooms: () => void;
  loadingFloors: boolean;
  disabledFloors: boolean;
  disabledRooms: boolean;
}

export default function FloorRoomsList({
  floors,
  selectedFloor,
  onSelectFloor,
  onAddFloor,
  onDeleteFloor,
  onAddRoom,
  onBulkAddRooms,
  loadingFloors,
  disabledFloors,
  disabledRooms,
}: FloorRoomsListProps) {
  const currentRooms = selectedFloor?.rooms || [];

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden min-h-0">
      {/* Floors Card */}
      <div
        className={`flex-1 flex flex-col bg-hosteloom-surface border border-hosteloom-border rounded-2xl overflow-hidden transition-all duration-500 ${
          disabledFloors ? "opacity-40 grayscale pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="p-5 border-b border-hosteloom-border flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent">
              <FiLayers className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide">Floors</h3>
          </div>
          {!disabledFloors && (
            <button
              onClick={onAddFloor}
              className="w-8 h-8 rounded-full bg-hosteloom-surface-light border border-hosteloom-border flex items-center justify-center text-white hover:bg-hosteloom-accent hover:border-hosteloom-accent transition-all group"
            >
              <FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {disabledFloors ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-50">
              <p className="text-[10px] font-heading uppercase tracking-widest">Select a block first</p>
            </div>
          ) : loadingFloors ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 opacity-50">
              <div className="w-4 h-4 border-2 border-hosteloom-accent border-t-transparent animate-spin rounded-full" />
            </div>
          ) : floors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-50">
              <p className="text-xs font-body uppercase tracking-wider">No floors found.</p>
            </div>
          ) : (
            floors.map((f) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={f.id}
                onClick={() => onSelectFloor(f)}
                className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedFloor?.id === f.id
                    ? "bg-hosteloom-accent/10 border-hosteloom-accent/30 text-white"
                    : "bg-hosteloom-surface-light border-hosteloom-border hover:border-white/20 hover:bg-hosteloom-surface-light/80"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-heading font-bold text-sm">{f.name}</div>
                    <div className="text-[10px] text-hosteloom-muted mt-0.5 font-medium tracking-widest uppercase">
                      {f.rooms?.length || 0} Rooms
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => onDeleteFloor(f.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-hosteloom-secondary hover:bg-hosteloom-secondary/10 rounded-lg transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                    <FiChevronRight
                      className={`transition-[opacity,transform] duration-300 ${
                        selectedFloor?.id === f.id
                          ? "translate-x-1 opacity-100 text-hosteloom-accent"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Rooms Card */}
      <div
        className={`flex-1 flex flex-col bg-hosteloom-surface border border-hosteloom-border rounded-2xl overflow-hidden transition-all duration-500 ${
          disabledRooms ? "opacity-40 grayscale pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="p-5 border-b border-hosteloom-border flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent">
              <FiGrid className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide">Rooms</h3>
          </div>
          {!disabledRooms && (
            <div className="flex gap-2">
              <button
                onClick={onBulkAddRooms}
                className="px-3 py-1.5 bg-hosteloom-surface-light text-hosteloom-accent border border-hosteloom-accent/30 rounded-lg text-[10px] font-heading font-bold uppercase tracking-widest hover:bg-hosteloom-accent/10 transition-colors flex items-center gap-1.5"
              >
                <FiCopy className="w-3 h-3" /> Bulk Add
              </button>
              <button
                onClick={onAddRoom}
                className="px-3 py-1.5 bg-hosteloom-accent rounded-lg text-[10px] font-heading font-bold uppercase tracking-widest text-white hover:bg-hosteloom-accent-hover transition-colors flex items-center gap-1"
              >
                <FiPlus /> Add
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {disabledRooms ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-50 text-hosteloom-muted">
              <FiGrid className="w-6 h-6 mb-1" />
              <p className="text-[10px] font-heading uppercase tracking-widest">Select a floor first</p>
            </div>
          ) : currentRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-50">
              <p className="text-xs font-body uppercase tracking-wider">Empty floor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {currentRooms.map((r: Room) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  key={r.id}
                  className="p-3 border border-hosteloom-border rounded-xl bg-hosteloom-surface-light/50 text-center relative overflow-hidden group hover:border-hosteloom-accent/30 transition-all pointer-events-none"
                >
                  <div className="absolute inset-0 bg-hosteloom-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="font-mono text-xs font-black text-white">{r.roomNumber}</div>
                    <div className="flex items-center justify-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-[8px] text-hosteloom-muted font-heading font-bold uppercase">
                        <FiUser size={8} className="text-hosteloom-accent" /> {r.capacity}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-hosteloom-border" />
                      <div className="text-[8px] text-white/50 font-heading font-bold uppercase tracking-tighter">
                        ₦{(parseInt(r.price || "0") / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
