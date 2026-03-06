"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdBedroomParent, MdAdd, MdPlaylistAdd, MdRefresh, MdSearch, MdPersonAdd } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomsStore, useStudentsStore } from '@/store';
import type { RoomStatus } from '@/types';
import RoomCard from '@/components/rooms/RoomCard';
import CreateRoomModal from '@/components/rooms/CreateRoomModal';
import BulkCreateRoomsModal from '@/components/rooms/BulkCreateRoomsModal';
import AllocateRoomModal from '@/components/rooms/AllocateRoomModal';
import RoomDetailModal from '@/components/rooms/RoomDetailModal';

const STATUS_FILTERS: Array<RoomStatus | 'ALL' | 'INACTIVE'> = ['ALL', 'VACANT', 'OCCUPIED', 'FULL', 'INACTIVE'];

const filterColor: Record<string, string> = {
  ALL: '',
  VACANT: 'text-green-400',
  OCCUPIED: 'text-yellow-400',
  FULL: 'text-red-400',
  INACTIVE: 'text-hosteloom-muted',
};

export default function RoomsPage() {
  const {
    rooms, roomsLoading, roomsError,
    availableRooms,
    fetchRooms, fetchAvailableRooms,
    createRoom, bulkCreateRooms, updateRoom, allocateRoom,
  } = useRoomsStore();

  const { students, fetchStudents } = useStudentsStore();

  const [filter, setFilter] = useState<RoomStatus | 'ALL' | 'INACTIVE'>('ALL');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<import('@/types').RoomWithDetails | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchAvailableRooms();
    fetchStudents();
  }, [fetchRooms, fetchAvailableRooms, fetchStudents]);

  useEffect(() => {
    if (roomsError) {
      toast.error(roomsError);
    }
  }, [roomsError]);

  const visible = rooms.filter((r) => {
    if (filter === 'INACTIVE') return !r.isActive;
    if (!r.isActive) return false;
    if (filter !== 'ALL' && r.status !== filter) return false;
    const q = search.toLowerCase();
    if (q && !r.roomNumber.toLowerCase().includes(q)) return false;
    return true;
  });

  const counts = {
    ALL: rooms.filter((r) => r.isActive).length,
    VACANT: rooms.filter((r) => r.isActive && r.status === 'VACANT').length,
    OCCUPIED: rooms.filter((r) => r.isActive && r.status === 'OCCUPIED').length,
    FULL: rooms.filter((r) => r.isActive && r.status === 'FULL').length,
    INACTIVE: rooms.filter((r) => !r.isActive).length,
  };

  const handleCreateRoom = async (payload: Parameters<typeof createRoom>[0]) => {
    const ok = await createRoom(payload);
    if (ok) toast.success(`Room ${payload.roomNumber} created`);
    else toast.error('Failed to create room');
    return ok;
  };

  const handleBulkCreate = async (payload: Parameters<typeof bulkCreateRooms>[0]) => {
    const count = await bulkCreateRooms(payload);
    if (count !== false) toast.success(`${count} rooms created`);
    else toast.error('Failed to bulk create rooms');
    return count;
  };

  const handleAllocate = async (payload: Parameters<typeof allocateRoom>[0]) => {
    const result = await allocateRoom(payload);
    if (result) toast.success('Room allocated successfully');
    else toast.error('Failed to allocate room');
    return result;
  };

  const handleUpdateRoom = async (roomId: string, payload: Parameters<typeof updateRoom>[1]) => {
    const ok = await updateRoom(roomId, payload);
    if (ok) {
       if (payload.isActive !== undefined) {
          toast.success(`Room ${payload.isActive ? 'activated' : 'deactivated'}`);
       } else if (payload.capacity !== undefined) {
          toast.success(`Room capacity updated`);
       }
    } else {
       toast.error('Failed to update room');
    }
    return ok;
  };

  const activeAllocatedStudentIds = new Set(
    rooms.flatMap((r) => r.allocations?.filter((a) => a.status === 'ACTIVE').map((a) => a.studentId) || [])
  );
  const unallocatedStudents = students.filter(s => !activeAllocatedStudentIds.has(s.userId));

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Rooms</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage rooms, capacity and allocations.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAllocate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hosteloom-accent/15 text-hosteloom-accent hover:bg-hosteloom-accent/25 transition-all text-sm font-heading font-bold"
          >
            <MdPersonAdd className="w-4 h-4" /> Allocate
          </button>
          <button
            onClick={() => setShowBulkCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-400/30 text-green-400 hover:bg-green-400/10 transition-all text-sm font-heading"
          >
            <MdPlaylistAdd className="w-4 h-4" /> Bulk Create
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
          >
            <MdAdd className="w-4 h-4" /> Add Room
          </button>
          <button
            onClick={() => { fetchRooms(); fetchAvailableRooms(); }}
            disabled={roomsLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
          >
            <MdRefresh className={`w-4 h-4 ${roomsLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-widest transition-all ${
              filter === s
                ? 'bg-hosteloom-accent text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-white'
            }`}
          >
            <span className={filter !== s ? filterColor[s] : ''}>{s}</span>
            {' '}
            <span className="opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted">
          <MdSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by room number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-hosteloom-surface border border-hosteloom-border rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
        />
      </div>



      {/* Loading skeleton */}
      {roomsLoading && rooms.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!roomsLoading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <MdBedroomParent className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No rooms found</p>
            <p className="text-hosteloom-muted text-sm mt-1">Create a room to get started.</p>
          </div>
        </div>
      )}

      {/* Room grid */}
      {visible.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {visible.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <RoomCard room={room} onUpdate={handleUpdateRoom} onClick={() => setSelectedRoom(room)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateRoomModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreateRoom} />
      <BulkCreateRoomsModal open={showBulkCreate} onClose={() => setShowBulkCreate(false)} onSubmit={handleBulkCreate} />
      <AllocateRoomModal
        open={showAllocate}
        onClose={() => setShowAllocate(false)}
        students={unallocatedStudents}
        availableRooms={availableRooms}
        onSubmit={handleAllocate}
      />
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  );
}
