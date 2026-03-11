"use client";

import React, { useEffect, useState } from 'react';
import { useProfileStore, useBlocksStore, useFloorsStore, useRoomsStore, useHostelsStore } from '@/store';
import { toast } from 'sonner';
import type { Block, Floor, Hostel } from '@/types';

import BlockList from '@/components/rooms/BlockList';
import FloorRoomsList from '@/components/rooms/FloorRoomsList';
import StructureModal from '@/components/rooms/StructureModal';

export default function AdminStructurePage() {
  const { adminProfile, fetchAdminProfile } = useProfileStore();
  const { blocks, blocksLoading, fetchBlocksByHostel, createBlock, deleteBlock } = useBlocksStore();
  const { floors, floorsLoading, fetchFloorsByBlock, createFloor, deleteFloor } = useFloorsStore();
  const { createRoom, bulkCreateRooms } = useRoomsStore();
  const { fetchHostelById } = useHostelsStore();

  const [myHostel, setMyHostel] = useState<Hostel | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  // Modals
  const [creatingType, setCreatingType] = useState<'block'|'floor'|'room'|'bulk-rooms'|null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!adminProfile) {
        await fetchAdminProfile();
        return;
      }

      const hostelId = adminProfile.hostelId;
      if (hostelId) {
        const h = await fetchHostelById(hostelId);
        if (h) {
          setMyHostel(h);
          fetchBlocksByHostel(hostelId);
        }
      }
    };
    init();
  }, [adminProfile, fetchAdminProfile, fetchHostelById, fetchBlocksByHostel]);

  useEffect(() => {
    if (selectedBlock) {
      fetchFloorsByBlock(selectedBlock.id);
      setSelectedFloor(null);
    }
  }, [selectedBlock, fetchFloorsByBlock]);

  useEffect(() => {
    if (selectedFloor) {
      const updatedFloor = floors.find(f => f.id === selectedFloor.id);
      if (updatedFloor) {
        setSelectedFloor(updatedFloor);
      }
    }
  }, [floors]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;

    try {
      if (creatingType === 'block' && myHostel) {
        const res = await createBlock({ name: formData.name, hostelId: myHostel.id });
        if (res) success = true;
      } else if (creatingType === 'floor' && selectedBlock) {
        const res = await createFloor({ name: formData.name, blockId: selectedBlock.id });
        if (res) {
          success = true;
          fetchFloorsByBlock(selectedBlock.id);
        }
      } else if (creatingType === 'room' && selectedFloor) {
        const res = await createRoom({
          roomNumber: formData.roomNumber,
          capacity: parseInt(formData.capacity, 10),
          price: parseInt(formData.price, 10),
          floorId: selectedFloor.id
        });
        if (res) {
          success = true;
          if (selectedBlock) fetchFloorsByBlock(selectedBlock.id);
        }
      } else if (creatingType === 'bulk-rooms' && selectedFloor) {
        const res = await bulkCreateRooms({
          prefix: formData.prefix,
          start: parseInt(formData.start, 10),
          end: parseInt(formData.end, 10),
          capacity: parseInt(formData.capacity, 10),
          price: parseInt(formData.price, 10),
          floorId: selectedFloor.id
        });
        if (res !== false) {
          success = true;
          if (selectedBlock) fetchFloorsByBlock(selectedBlock.id);
        }
      }

      if (success) {
        toast.success(`${creatingType?.replace('-', ' ')} created successfully!`);
        setCreatingType(null);
        setFormData({});
      }
    } catch (error) {
       toast.error(`Error creating ${creatingType}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: 'block'|'floor', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    let res = false;
    if (type === 'block') res = await deleteBlock(id);
    if (type === 'floor') {
      res = await deleteFloor(id);
      if (res && selectedBlock) fetchFloorsByBlock(selectedBlock.id);
    }

    if (res) {
      toast.success(`${type} deleted!`);
      if (type === 'block' && selectedBlock?.id === id) setSelectedBlock(null);
      if (type === 'floor' && selectedFloor?.id === id) setSelectedFloor(null);
    } else {
      toast.error(`Error deleting ${type}`);
    }
  };

  if (!myHostel) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-hosteloom-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-hosteloom-muted text-sm font-heading">Loading hostel information...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 overflow-hidden">
      <div>
        <p className="text-hosteloom-accent text-[10px] font-heading font-bold uppercase tracking-widest mb-1">
          {myHostel.name} Structure
        </p>
        <h1 className="text-3xl font-heading font-bold">Hostel Structure</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">Manage blocks, floors, and rooms for your hostel.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 text-white">
        <BlockList
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelect={setSelectedBlock}
          onAdd={() => { setFormData({}); setCreatingType('block'); }}
          onDelete={(id, e) => handleDelete('block', id, e)}
          loading={blocksLoading}
          disabled={false}
        />

        <FloorRoomsList
          floors={floors}
          selectedFloor={selectedFloor}
          onSelectFloor={setSelectedFloor}
          onAddFloor={() => { setFormData({}); setCreatingType('floor'); }}
          onDeleteFloor={(id, e) => handleDelete('floor', id, e)}
          onAddRoom={() => { setFormData({}); setCreatingType('room'); }}
          onBulkAddRooms={() => { setFormData({}); setCreatingType('bulk-rooms'); }}
          loadingFloors={floorsLoading}
          disabledFloors={!selectedBlock}
          disabledRooms={!selectedFloor}
        />
      </div>

      <StructureModal
        creatingType={creatingType}
        onClose={() => setCreatingType(null)}
        onSubmit={handleCreate}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
