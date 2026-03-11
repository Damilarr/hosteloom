"use client";

import React, { useState } from 'react';
import { MdBedroomParent, MdPeople, MdEdit, MdToggleOn, MdToggleOff, MdClose } from 'react-icons/md';
import type { RoomWithDetails, UpdateRoomPayload } from '@/types';

interface Props {
  room: RoomWithDetails;
  onUpdate: (roomId: string, payload: UpdateRoomPayload) => Promise<boolean>;
  onClick?: () => void;
}

const statusBadge: Record<string, string> = {
  VACANT:              'bg-green-400/15 text-green-400 border-green-400/30',
  OCCUPIED:            'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
  PARTIALLY_OCCUPIED:  'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
  FULL:                'bg-red-400/15 text-red-400 border-red-400/30',
};

const statusLabel: Record<string, string> = {
  VACANT:              'Vacant',
  OCCUPIED:            'Occupied',
  PARTIALLY_OCCUPIED:  'Partial',
  FULL:                'Full',
};

export default function RoomCard({ room, onUpdate, onClick }: Props) {
  const [editing, setEditing] = useState(false);
  const [capacity, setCapacity] = useState(room.capacity);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggleActive = async () => {
    setToggling(true);
    await onUpdate(room.id, { isActive: !room.isActive });
    setToggling(false);
  };

  const handleSaveCapacity = async () => {
    if (capacity === room.capacity) { setEditing(false); return; }
    setSaving(true);
    const ok = await onUpdate(room.id, { capacity });
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <div className={`bg-hosteloom-surface border rounded-2xl p-5 space-y-3 transition-all ${
      room.isActive ? 'border-hosteloom-border hover:border-hosteloom-accent/40' : 'border-hosteloom-border/50 opacity-60'
    }`}>
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center">
            <MdBedroomParent className="w-5 h-5 text-hosteloom-accent" />
          </div>
          <div>
            <p className="font-heading font-bold text-white">{room.roomNumber}</p>
            <p className="text-[11px] text-hosteloom-muted">
              {room.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-heading font-bold uppercase tracking-widest shrink-0 ${statusBadge[room.status] ?? statusBadge.VACANT}`}>
          {statusLabel[room.status] ?? room.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-hosteloom-muted">
        <span className="flex items-center gap-1">
          <MdPeople className="w-3.5 h-3.5" />
          {room.occupancyCount} / {room.capacity}
        </span>
        <span>
          {room.allocations.length} allocation{room.allocations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hosteloom-border text-xs font-heading text-hosteloom-muted hover:text-white hover:border-hosteloom-accent/50 transition-all disabled:opacity-50"
        >
          {room.isActive
            ? <><MdToggleOff className="w-4 h-4" /> Deactivate</>
            : <><MdToggleOn className="w-4 h-4" /> Activate</>
          }
        </button>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hosteloom-border text-xs font-heading text-hosteloom-muted hover:text-white hover:border-hosteloom-accent/50 transition-all"
          >
            <MdEdit className="w-3.5 h-3.5" /> Edit Capacity
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={20}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-16 bg-hosteloom-bg border border-hosteloom-border rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-hosteloom-accent transition-all"
            />
            <button
              onClick={handleSaveCapacity}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-hosteloom-accent text-white text-xs font-heading font-bold transition-all disabled:opacity-50"
            >
              {saving ? '…' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setCapacity(room.capacity); }}
              className="px-2 py-1.5 rounded-lg border border-hosteloom-border text-xs text-hosteloom-muted hover:text-white transition-all"
            >
              <MdClose className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
