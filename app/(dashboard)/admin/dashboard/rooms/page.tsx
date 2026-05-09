"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdBedroomParent, MdAdd, MdPlaylistAdd, MdRefresh, MdSearch } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomsStore, useHostelsStore, useProfileStore, useAuthStore } from '@/store';
import type { RoomStatus } from '@/types';
import RoomCard from '@/components/rooms/RoomCard';
import CreateRoomModal from '@/components/rooms/CreateRoomModal';
import BulkCreateRoomsModal from '@/components/rooms/BulkCreateRoomsModal';
import RoomDetailModal from '@/components/rooms/RoomDetailModal';
import DeleteRoomsWarningModal from '@/components/rooms/DeleteRoomsWarningModal';
import Tooltip from '@/components/ui/Tooltip';

const STATUS_FILTERS: Array<RoomStatus | 'ALL' | 'INACTIVE'> = ['ALL', 'VACANT', 'OCCUPIED', 'FULL', 'INACTIVE'];

const filterColor: Record<string, string> = {
  ALL: '',
  VACANT: 'text-emerald-600',
  OCCUPIED: 'text-amber-600',
  FULL: 'text-red-400',
  INACTIVE: 'text-hosteloom-muted',
};

export default function RoomsPage() {
  const {
    rooms, roomsMeta, roomsLoading, roomsError,
    fetchRooms,
    createRoom, bulkCreateRooms, updateRoom,
  } = useRoomsStore();

  const { currentHostel, fetchHostelById, hostelsLoading } = useHostelsStore();
  const { adminProfile } = useProfileStore();
  const { user } = useAuthStore();

  const [filter, setFilter] = useState<RoomStatus | 'ALL' | 'INACTIVE'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [showCreate, setShowCreate] = useState(false);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<import('@/types').RoomWithDetails | null>(null);

  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteWarningType, setDeleteWarningType] = useState<'BLOCK' | 'HOSTEL'>('BLOCK');

  const checkHostelStructure = () => {
    if (hostelsLoading) return true; 
    if (!currentHostel) return true;
    
    const hasBlocks = currentHostel.blocks && currentHostel.blocks.length > 0;
    const hasFloors = currentHostel.blocks?.some(b => b.floors && b.floors.length > 0);

    if (!hasBlocks || !hasFloors) {
      toast.error('Hostel setup incomplete. Please create a block and floor first.', {
        action: { label: 'Go to Structure', onClick: () => window.location.href = '/admin/dashboard/structure' },
      });
      return false;
    }
    return true;
  };

  const handleOpenCreateRoom = () => {
    if (checkHostelStructure()) {
      setShowCreate(true);
    }
  };

  const handleOpenBulkCreateRoom = () => {
    if (checkHostelStructure()) {
      setShowBulkCreate(true);
    }
  };

  useEffect(() => {
    fetchRooms(page, LIMIT);
  }, [fetchRooms, page]);

  useEffect(() => {
    if (user?.role === 'HOSTEL_ADMIN' && adminProfile?.hostelId) {
      fetchHostelById(adminProfile.hostelId);
    }
  }, [user?.role, adminProfile?.hostelId, fetchHostelById]);

  useEffect(() => {
    if (roomsError) {
      toast.error(roomsError);
    }
  }, [roomsError]);

  const visible = rooms.filter((r) => {
    if (filter === 'INACTIVE') return !r.isActive;
    if (!r.isActive) return false;
    if (filter !== 'ALL') {
      const effectiveStatus = (r.status as string) === 'PARTIALLY_OCCUPIED' ? 'OCCUPIED' : r.status;
      if (effectiveStatus !== filter) return false;
    }
    const q = search.toLowerCase();
    if (q && !r.roomNumber.toLowerCase().includes(q)) return false;
    return true;
  });

  const counts = {
    ALL: roomsMeta?.total ?? rooms.filter((r) => r.isActive).length,
    VACANT: rooms.filter((r) => r.isActive && r.status === 'VACANT').length,
    OCCUPIED: rooms.filter((r) => r.isActive && (r.status === 'OCCUPIED' || (r.status as string) === 'PARTIALLY_OCCUPIED')).length,
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



  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }).map((_, i) => i + 1);
    
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    if (currentPage >= totalPages - 2) return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = roomsMeta ? generatePagination(roomsMeta.page, roomsMeta.totalPages) : [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Rooms</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage rooms and capacity. Students select their own rooms after approval.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tooltip content="Permanently delete rooms by block" position="bottom">
            <button
               onClick={() => { setDeleteWarningType('BLOCK'); setDeleteWarningOpen(true); }}
               className="px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 font-heading text-sm hover:bg-red-500/10 transition-all font-bold"
            >
              Delete Block Rooms
            </button>
          </Tooltip>
          <Tooltip content="Permanently delete all hostel rooms" position="bottom">
            <button
               onClick={() => { setDeleteWarningType('HOSTEL'); setDeleteWarningOpen(true); }}
               className="px-4 py-2.5 rounded-xl bg-red-500 text-white font-heading text-sm hover:bg-red-600 transition-all font-bold ml-2"
            >
               Clear Hostel
            </button>
          </Tooltip>

          <div className="w-px h-6 bg-hosteloom-border mx-2 hidden sm:block"></div>

          <Tooltip content="Create multiple rooms at once for a floor" position="bottom">
            <button
              onClick={handleOpenBulkCreateRoom}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-green-400/10 transition-all text-sm font-heading"
            >
              <MdPlaylistAdd className="w-4 h-4" /> Bulk Create
            </button>
          </Tooltip>
          <Tooltip content="Add a single room to a floor" position="bottom">
            <button
              onClick={handleOpenCreateRoom}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-hosteloom-heading hover:border-hosteloom-accent transition-all text-sm font-heading"
            >
              <MdAdd className="w-4 h-4" /> Add Room
            </button>
          </Tooltip>
          <button
            onClick={() => { fetchRooms(page, LIMIT); }}
            disabled={roomsLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-hosteloom-heading hover:border-hosteloom-accent transition-all text-sm font-heading"
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
                : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-hosteloom-heading'
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
          className="w-full max-w-sm bg-hosteloom-surface border border-hosteloom-border rounded-xl py-3 pl-11 pr-4 text-hosteloom-heading placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent transition-all font-body text-sm"
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
            <p className="font-heading font-semibold text-hosteloom-heading">No rooms found</p>
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

      {/* Pagination Controls */}
      {roomsMeta && roomsMeta.totalPages > 1 && (
        <div className="flex items-center justify-between py-4 border-t border-hosteloom-border mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-hosteloom-surface border border-hosteloom-border rounded-xl text-sm font-heading text-hosteloom-heading hover:border-hosteloom-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {pages.map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && setPage(p)}
                disabled={p === '...'}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-heading font-medium transition-all ${
                  p === roomsMeta.page
                    ? 'bg-hosteloom-accent text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : p === '...'
                    ? 'text-hosteloom-muted cursor-default'
                    : 'bg-hosteloom-surface border border-hosteloom-border text-hosteloom-muted hover:text-hosteloom-heading hover:border-hosteloom-accent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(roomsMeta.totalPages, p + 1))}
            disabled={page === roomsMeta.totalPages}
            className="px-4 py-2 bg-hosteloom-surface border border-hosteloom-border rounded-xl text-sm font-heading text-hosteloom-heading hover:border-hosteloom-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}

      <CreateRoomModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreateRoom} />
      <BulkCreateRoomsModal open={showBulkCreate} onClose={() => setShowBulkCreate(false)} onSubmit={handleBulkCreate} />
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      
      <DeleteRoomsWarningModal 
         open={deleteWarningOpen} 
         onClose={() => setDeleteWarningOpen(false)} 
         targetType={deleteWarningType} 
         hostelId={currentHostel?.id || null} 
      />
    </div>
  );
}
