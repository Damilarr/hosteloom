"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MdClose, MdPeople, MdBedroomParent, MdLogout, MdSwapHoriz,
} from 'react-icons/md';
import { useRoomsStore } from '@/store';
import type { RoomWithDetails, AvailableRoom } from '@/types';

interface Props {
  room: RoomWithDetails | null;
  onClose: () => void;
}

const statusBadge: Record<string, string> = {
  VACANT:   'bg-green-400/15 text-green-400',
  OCCUPIED: 'bg-yellow-400/15 text-yellow-400',
  FULL:     'bg-red-400/15 text-red-400',
};

export default function RoomDetailModal({ room, onClose }: Props) {
  const {
    occupants, occupantsLoading,
    availableRooms,
    fetchOccupants, fetchAvailableRooms,
    checkoutRoom, reassignRoom,
  } = useRoomsStore();

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [reassignTarget, setReassignTarget] = useState<string | null>(null);
  const [newRoomId, setNewRoomId] = useState('');

  useEffect(() => {
    if (room) {
      fetchOccupants(room.id);
      fetchAvailableRooms();
    }
  }, [room, fetchOccupants, fetchAvailableRooms]);

  const startProcessing = (id: string) =>
    setProcessingIds((prev) => new Set(prev).add(id));
  const stopProcessing = (id: string) =>
    setProcessingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });

  const handleCheckout = async (allocationId: string) => {
    startProcessing(allocationId);
    const ok = await checkoutRoom(allocationId);
    stopProcessing(allocationId);
    if (ok) {
      toast.success('Student checked out');
      if (room) fetchOccupants(room.id);
    } else {
      toast.error('Checkout failed');
    }
  };

  const handleReassign = async (studentId: string) => {
    if (!newRoomId) return;
    startProcessing(studentId);
    const ok = await reassignRoom({ studentId, newRoomId });
    stopProcessing(studentId);
    if (ok) {
      toast.success('Student reassigned');
      setReassignTarget(null);
      setNewRoomId('');
      if (room) fetchOccupants(room.id);
    } else {
      toast.error('Reassignment failed');
    }
  };

  // Filter out the current room from available rooms for reassignment
  const otherRooms: AvailableRoom[] = room
   ? availableRooms.filter((r) => r.id !== room.id)
    : [];

  return (
    <AnimatePresence>
      {room && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-hosteloom-surface border-b border-hosteloom-border p-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center">
                  <MdBedroomParent className="w-5 h-5 text-hosteloom-accent" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white">Room {room.roomNumber}</p>
                  <p className="text-xs text-hosteloom-muted">
                    {room.occupancyCount} / {room.capacity} occupants
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-bold uppercase tracking-widest ${statusBadge[room.status] ?? ''}`}>
                  {room.status}
                </span>
                <button onClick={onClose} className="text-hosteloom-muted hover:text-white transition-colors">
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {occupantsLoading && (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-16 bg-hosteloom-bg border border-hosteloom-border rounded-xl animate-pulse" />
                  ))}
                </div>
              )}

              {!occupantsLoading && occupants.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center gap-3">
                  <MdPeople className="w-8 h-8 text-hosteloom-muted" />
                  <p className="text-sm text-hosteloom-muted">No occupants in this room</p>
                </div>
              )}

              {!occupantsLoading && occupants.length > 0 && (
                <div className="space-y-3">
                  {occupants.map((occ) => {
                    const p = occ.student.profile;
                    const isProcessing = processingIds.has(occ.id) || processingIds.has(occ.studentId);
                    const isReassigning = reassignTarget === occ.studentId;

                    return (
                      <div key={occ.id} className="bg-hosteloom-bg border border-hosteloom-border rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-hosteloom-accent/20 flex items-center justify-center font-heading font-bold text-sm text-hosteloom-accent shrink-0">
                              {p.firstName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-heading font-semibold text-white">{p.firstName} {p.lastName}</p>
                              <p className="text-[11px] text-hosteloom-muted">{p.matricNo} · Level {p.academicLevel}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            occ.status === 'ACTIVE' ? 'bg-green-400/15 text-green-400' : 'bg-hosteloom-muted/15 text-hosteloom-muted'
                          }`}>
                            {occ.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-hosteloom-muted">{occ.student.email}</p>

                        {occ.status === 'ACTIVE' && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleCheckout(occ.id)}
                              disabled={isProcessing}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400/30 text-xs font-heading text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
                            >
                              <MdLogout className="w-3.5 h-3.5" /> Checkout
                            </button>
                            <button
                              onClick={() => {
                                if (isReassigning) { setReassignTarget(null); setNewRoomId(''); }
                                else setReassignTarget(occ.studentId);
                              }}
                              disabled={isProcessing}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hosteloom-border text-xs font-heading text-hosteloom-muted hover:text-white hover:border-hosteloom-accent/50 transition-all disabled:opacity-50"
                            >
                              <MdSwapHoriz className="w-3.5 h-3.5" /> Reassign
                            </button>
                          </div>
                        )}

                        {isReassigning && (
                          <div className="flex items-center gap-2 pt-1">
                            <select
                              value={newRoomId}
                              onChange={(e) => setNewRoomId(e.target.value)}
                              className="flex-1 bg-hosteloom-surface border border-hosteloom-border rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-hosteloom-accent transition-all appearance-none cursor-pointer"
                            >
                              <option value="">Select room…</option>
                              {otherRooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.roomNumber} — {r.remainingCapacity} available
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleReassign(occ.studentId)}
                              disabled={!newRoomId || isProcessing}
                              className="px-3 py-1.5 rounded-lg bg-hosteloom-accent text-white text-xs font-heading font-bold transition-all disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
