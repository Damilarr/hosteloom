'use client';

import { useEffect, useState } from 'react';
import { useHostelsStore, useBlocksStore, useFloorsStore, useRoomsStore } from '@/store';
import { toast } from 'sonner';
import type { Hostel, Block, Floor } from '@/types';

import HostelList from '@/components/rooms/HostelList';
import BlockList from '@/components/rooms/BlockList';
import FloorRoomsList from '@/components/rooms/FloorRoomsList';
import StructureModal from '@/components/rooms/StructureModal';

export default function HostelsManagerPage() {
  const { hostels, hostelsLoading, fetchAllHostels, createHostel, deleteHostel } = useHostelsStore();
  const { blocks, blocksLoading, fetchBlocksByHostel, createBlock, deleteBlock } = useBlocksStore();
  const { floors, floorsLoading, fetchFloorsByBlock, createFloor, deleteFloor } = useFloorsStore();
  const { createRoom, bulkCreateRooms } = useRoomsStore();

  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  // Modals
  const [creatingType, setCreatingType] = useState<'hostel'|'block'|'floor'|'room'|'bulk-rooms'|null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllHostels();
  }, [fetchAllHostels]);

  useEffect(() => {
    if (selectedHostel) {
      fetchBlocksByHostel(selectedHostel.id);
      setSelectedBlock(null);
      setSelectedFloor(null);
    }
  }, [selectedHostel, fetchBlocksByHostel]);

  useEffect(() => {
    if (selectedBlock) {
      fetchFloorsByBlock(selectedBlock.id);
      setSelectedFloor(null);
    }
  }, [selectedBlock, fetchFloorsByBlock]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;

    try {
      if (creatingType === 'hostel') {
        const res = await createHostel({ name: formData.name, description: formData.description, address: formData.address });
        if (res) success = true;
      } else if (creatingType === 'block' && selectedHostel) {
        const res = await createBlock({ name: formData.name, hostelId: selectedHostel.id });
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

  const handleDelete = async (type: 'hostel'|'block'|'floor', id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    let res = false;
    if (type === 'hostel') res = await deleteHostel(id);
    if (type === 'block') res = await deleteBlock(id);
    if (type === 'floor') {
      res = await deleteFloor(id);
      if (res && selectedBlock) fetchFloorsByBlock(selectedBlock.id);
    }

    if (res) {
      toast.success(`${type} deleted!`);
      if (type === 'hostel' && selectedHostel?.id === id) setSelectedHostel(null);
      if (type === 'block' && selectedBlock?.id === id) setSelectedBlock(null);
      if (type === 'floor' && selectedFloor?.id === id) setSelectedFloor(null);
    } else {
      toast.error(`Error deleting ${type}`);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 overflow-hidden">
      <div>
        <p className="text-hosteloom-accent text-[10px] font-heading font-bold uppercase tracking-widest mb-1">
          Property Management
        </p>
        <h1 className="text-3xl font-heading font-bold">Hostels</h1>
        <p className="text-hosteloom-muted font-body text-sm mt-1">Manage your properties and assign admins to them.</p>
      </div>

      <div className="flex-1 max-w-2xl overflow-hidden min-h-0 text-white">
        <HostelList
          hostels={hostels}
          selectedHostel={selectedHostel}
          onSelect={setSelectedHostel}
          onAdd={() => { setFormData({}); setCreatingType('hostel'); }}
          onDelete={(id, e) => handleDelete('hostel', id, e)}
          loading={hostelsLoading}
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
