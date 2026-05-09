"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useRoomsStore, useApplicationsStore, useAuthStore, useInvoicesStore } from '@/store';
import { Loader } from '@/components/ui/Loader';
import { toast } from 'sonner';
import Link from 'next/link';
import { MdBedroomParent, MdSearch, MdKeyboardArrowDown, MdAccessTime } from 'react-icons/md';

export default function SelectRoomPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    availableRoomsForStudent, 
    availableRoomsForStudentLoading, 
    fetchAvailableRoomsForStudent, 
    pickRoom,
    studentHistory,
    fetchStudentHistory
  } = useRoomsStore();
  const { myApplications, fetchMyApplications } = useApplicationsStore();
  const { myInvoices, fetchMyInvoices } = useInvoicesStore();

  const [guardReady, setGuardReady] = useState(false);

  const currentApplication = myApplications.find((a) => a.status === 'APPROVED');
  const hasExistingAllocation = studentHistory.some((h) => h.status === 'ACTIVE' || (h.status as string) === 'PENDING_PAYMENT');
  const hasUnpaidInvoice = myInvoices.some((i) => i.status !== 'PAID');
  const shouldBlock = hasExistingAllocation || hasUnpaidInvoice;

  useEffect(() => {
    const init = async () => {
      if (user?.id) await fetchStudentHistory(user.id);
      await Promise.all([fetchMyApplications(), fetchMyInvoices()]);
      setGuardReady(true);
    };
    init();
  }, [user?.id, fetchStudentHistory, fetchMyApplications, fetchMyInvoices]);

  useEffect(() => {
    if (!guardReady) return;
    if (shouldBlock) {
      router.replace('/dashboard/payments');
    } else if (!currentApplication) {
      router.replace('/dashboard');
    } else {
      fetchAvailableRoomsForStudent();
    }
  }, [guardReady, shouldBlock, currentApplication, fetchAvailableRoomsForStudent, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedPrice, setSelectedPrice] = useState('ALL');

  const blocks = useMemo(() => Array.from(new Set(availableRoomsForStudent.map(r => r.block).filter(Boolean))), [availableRoomsForStudent]);
  const floors = useMemo(() => Array.from(new Set(availableRoomsForStudent.map(r => r.floor).filter(Boolean))), [availableRoomsForStudent]);
  const prices = useMemo(() => Array.from(new Set(availableRoomsForStudent.map(r => Number(r.price)).filter(p => !isNaN(p)))).sort((a, b) => a - b), [availableRoomsForStudent]);

  const filteredRooms = useMemo(() => {
    return availableRoomsForStudent.filter(room => {
      const q = searchQuery.toLowerCase();
      const matchSearch = String(room.roomNumber).toLowerCase().includes(q) 
                          || (room.block && room.block.toLowerCase().includes(q))
                          || (room.floor && room.floor.toLowerCase().includes(q));
      const matchBlock = selectedBlock === 'ALL' || room.block === selectedBlock;
      const matchFloor = selectedFloor === 'ALL' || room.floor === selectedFloor;
      const matchPrice = selectedPrice === 'ALL' || Number(room.price) === Number(selectedPrice);
      return matchSearch && matchBlock && matchFloor && matchPrice;
    });
  }, [availableRoomsForStudent, searchQuery, selectedBlock, selectedFloor, selectedPrice]);

  if (!guardReady) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader size={40} />
        <p className="text-hosteloom-muted text-sm font-heading tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  if (shouldBlock || !currentApplication) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center text-hosteloom-muted hover:text-hosteloom-heading hover:border-hosteloom-muted transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold">Select Your Room</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">Choose a room from the available options below to finalize your stay.</p>
        </div>
      </div>

      {/* 3-day payment deadline notice */}
      {!availableRoomsForStudentLoading && availableRoomsForStudent.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
          <MdAccessTime className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200/80 font-body leading-relaxed">
            <span className="font-semibold text-amber-300">Important:</span> After selecting a room, you have <span className="font-semibold text-amber-300">24 hours</span> to complete your payment. Unpaid reservations will be automatically released.
          </p>
        </div>
      )}

      {!availableRoomsForStudentLoading && availableRoomsForStudent.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-2xl">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-hosteloom-muted">
              <MdSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search rooms, blocks, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-hosteloom-card-bg border border-hosteloom-border rounded-xl py-3.5 pl-11 pr-4 text-hosteloom-heading placeholder:text-hosteloom-muted/50 focus:outline-none focus:border-hosteloom-accent/30 focus:ring-1 focus:ring-hosteloom-accent/30 transition-all font-body text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {blocks.length > 0 && (
              <div className="relative">
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="bg-hosteloom-card-bg border border-hosteloom-border rounded-xl py-3.5 pl-5 pr-10 text-hosteloom-heading text-sm font-heading focus:outline-none focus:border-hosteloom-accent/30 cursor-pointer shadow-sm hover:border-hosteloom-border transition-colors appearance-none"
                >
                  <option value="ALL">All Blocks</option>
                  {blocks.map(b => (typeof b === 'string' ? <option key={b} value={b}>{b}</option> : null))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-hosteloom-muted">
                  <MdKeyboardArrowDown className="w-5 h-5" />
                </div>
              </div>
            )}
            {floors.length > 0 && (
              <div className="relative">
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="bg-hosteloom-card-bg border border-hosteloom-border rounded-xl py-3.5 pl-5 pr-10 text-hosteloom-heading text-sm font-heading focus:outline-none focus:border-hosteloom-accent/30 cursor-pointer shadow-sm hover:border-hosteloom-border transition-colors appearance-none"
                >
                  <option value="ALL">All Floors</option>
                  {floors.map(f => (typeof f === 'string' ? <option key={f} value={f}>{f}</option> : null))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-hosteloom-muted">
                  <MdKeyboardArrowDown className="w-5 h-5" />
                </div>
              </div>
            )}
            {prices.length > 0 && (
              <div className="relative">
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="bg-hosteloom-card-bg border border-hosteloom-border rounded-xl py-3.5 pl-5 pr-10 text-hosteloom-heading text-sm font-heading focus:outline-none focus:border-hosteloom-accent/30 cursor-pointer shadow-sm hover:border-hosteloom-border transition-colors appearance-none"
                >
                  <option value="ALL">All Prices</option>
                  {prices.map(p => <option key={p} value={p}>{formatCurrency(p)}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-hosteloom-muted">
                  <MdKeyboardArrowDown className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-[400px]">
        {availableRoomsForStudentLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader size={40} />
            <p className="text-hosteloom-muted text-sm font-heading tracking-widest uppercase">Fetching Available Rooms</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div 
                key={room.id} 
                className="group relative bg-hosteloom-card-bg border border-hosteloom-border rounded-[20px] p-6 hover:border-hosteloom-accent/30 transition-all duration-500 overflow-hidden hover:shadow-[0_8px_30px_rgb(168,85,247,0.05)]"
              >
                {/* Minimalist ambient glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-hosteloom-accent/10 rounded-full blur-[40px] group-hover:bg-hosteloom-accent/20 transition-all duration-700 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6 relative z-10 gap-3">
                  <h3 className="text-4xl font-heading font-light tracking-tight text-hosteloom-heading group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-hosteloom-accent transition-all duration-500">
                    {room.roomNumber}
                  </h3>
                  
                  <div className="px-3 py-1.5 rounded-lg border border-hosteloom-border bg-hosteloom-hover-bg backdrop-blur-md shrink-0">
                    <p className="text-hosteloom-accent font-medium text-sm tracking-wide">
                      {formatCurrency(room.price)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6 relative z-10 space-y-2">
                  {room.block && (
                    <div className="flex text-xs">
                      <span className="w-14 text-hosteloom-muted/50 uppercase tracking-widest text-[9px] font-semibold mt-0.5 shrink-0">Block</span>
                      <span className="text-hosteloom-heading/80 font-medium break-words leading-tight">{room.block}</span>
                    </div>
                  )}
                  {room.floor && (
                    <div className="flex text-xs">
                      <span className="w-14 text-hosteloom-muted/50 uppercase tracking-widest text-[9px] font-semibold mt-0.5 shrink-0">Floor</span>
                      <span className="text-hosteloom-heading/80 font-medium break-words leading-tight">{room.floor}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-8 space-y-3 relative z-10">
                  <div className="flex justify-between items-center pb-3 border-b border-hosteloom-border">
                    <span className="text-[11px] text-hosteloom-muted tracking-[0.1em] uppercase">Capacity</span>
                    <span className="text-sm text-hosteloom-heading font-medium">{room.capacity} Persons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-hosteloom-muted tracking-[0.1em] uppercase">Available</span>
                    <span className="text-sm font-medium text-emerald-600 bg-green-400/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{room.remainingCapacity} Slots</span>
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    const res = await pickRoom({ roomId: room.id });
                    if (res) {
                      toast.success('Room selected! Redirecting to payment...');
                      if (user?.id) fetchStudentHistory(user.id);
                      fetchMyInvoices();
                      router.push('/dashboard/payments');
                    } else {
                      toast.error('Failed to select room. Please try again.');
                    }
                  }}
                  className="w-full py-2.5 bg-hosteloom-overlay-bg text-hosteloom-heading border border-hosteloom-border rounded-xl font-medium text-sm tracking-wide relative z-10 overflow-hidden group/btn hover:border-hosteloom-accent/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
                >
                  <span className="relative z-10 group-hover/btn:text-hosteloom-accent transition-colors duration-300 delay-75">Select Room</span>
                  {/* Subtle purple sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hosteloom-accent/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover/btn:translate-x-[150%] ease-out" style={{ transitionDuration: '600ms' }} />
                </button>
              </div>
            ))}
          </div>
        ) : availableRoomsForStudent.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border border-hosteloom-border bg-hosteloom-card-bg rounded-3xl">
            <MdSearch className="w-10 h-10 text-hosteloom-heading/10 mb-2" />
            <h3 className="font-heading font-light text-2xl text-hosteloom-heading mb-2 tracking-tight">No Matches Found</h3>
            <p className="text-hosteloom-muted font-body max-w-sm text-sm">We couldn't find any rooms matching your current filters. Try resetting them or searching for something else.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedBlock('ALL'); setSelectedFloor('ALL'); setSelectedPrice('ALL'); }} className="mt-6 px-6 py-2.5 bg-hosteloom-hover-bg border border-hosteloom-border text-hosteloom-heading rounded-xl hover:bg-hosteloom-hover-bg text-sm font-heading tracking-wide transition-all shadow-sm">Clear Filters</button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-hosteloom-bg border border-hosteloom-border flex items-center justify-center mb-4">
              <MdBedroomParent className="w-8 h-8 text-hosteloom-muted opacity-50" />
            </div>
            <h3 className="font-heading font-bold text-lg text-hosteloom-heading mb-2">No Rooms Available</h3>
            <p className="text-hosteloom-muted font-body max-w-sm">There are currently no rooms available in this hostel. Please contact the administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
