"use client";

import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { useAuthStore, useAdminsStore, useHostelsStore, useDashboardStore } from '@/store';
import { MdBedroomParent, MdPeople, MdPayment, MdHome } from 'react-icons/md';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/Loader';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const { createAdmin, adminsLoading } = useAdminsStore();
  const { hostels, fetchAllHostels } = useHostelsStore();
  const { summaryData, summaryLoading, fetchSummaryData } = useDashboardStore();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAllHostels();
    fetchSummaryData();
  }, [fetchAllHostels, fetchSummaryData]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    hostelId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createAdmin(formData);
    
    if (res?.message) {
      toast.success(res.message);
      setModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        hostelId: '',
      });
    } else {
      toast.error('Failed to create admin');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Owner Portal</p>
          <h1 className="font-heading text-3xl font-bold">Hostel Owner 👋</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">{user?.email}</p>
        </div>

        <button
          onClick={() => {
            if (hostels.length === 0) {
              toast.error('You must create a hostel first before adding an admin.');
              return;
            }
            setModalOpen(true);
          }}
          className="bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:bg-hosteloom-accent/80 transition-colors flex items-center gap-2"
        >
          <MdAdd className="w-5 h-5" />
          Create Admin
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hostels', value: summaryData?.totalHostels.toString() ?? hostels.length.toString(), sub: 'Managed properties', icon: MdHome, color: 'text-hosteloom-accent', bg: 'bg-hosteloom-accent/10' },
          { label: 'Total Rooms', value: summaryData?.totalRooms.toString() ?? '0', sub: `${summaryData?.capacity.vacantRooms ?? 0} vacant`, icon: MdBedroomParent, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Occupancy Rate', value: `${summaryData?.capacity.occupancyRatePercentage ?? 0}%`, sub: `${summaryData?.capacity.occupiedBeds ?? 0} beds filled`, icon: MdPeople, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Total Revenue', value: `₦${((summaryData?.financials.totalRevenue ?? 0) / 1000000).toFixed(1)}M`, sub: `${summaryData?.financials.pendingPayments ? `₦${summaryData.financials.pendingPayments.toLocaleString()} pending` : 'No pending payments'}`, icon: MdPayment, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        ].map((m) => (
          <div key={m.label} className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-5 hover:border-hosteloom-accent/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="font-heading font-bold text-2xl text-white">{summaryData ? m.value : '—'}</p>
            <p className="text-xs text-hosteloom-muted font-body mt-0.5">{m.label}</p>
            <p className="text-[10px] text-hosteloom-muted/70 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-8">
         <h2 className="font-heading font-bold text-xl mb-4">Welcome to your Owner Dashboard</h2>
         <p className="text-hosteloom-muted font-body text-sm">
           From here you can oversee your properties and create administrator accounts to manage daily operations.
         </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-hosteloom-muted hover:text-white"
            >
              <MdClose className="w-6 h-6" />
            </button>

            <h2 className="font-heading text-xl font-bold mb-6">Create New Admin</h2>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-heading tracking-widest text-hosteloom-muted uppercase mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-white placeholder:text-hosteloom-muted/50 focus:outline-none focus:border-hosteloom-accent transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-heading tracking-widest text-hosteloom-muted uppercase mb-1">Last Name</label>
                <input
                   type="text"
                   name="lastName"
                   value={formData.lastName}
                   onChange={handleChange}
                   className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-white placeholder:text-hosteloom-muted/50 focus:outline-none focus:border-hosteloom-accent transition-colors text-sm"
                   required
                />
              </div>

              <div>
                <label className="block text-xs font-heading tracking-widest text-hosteloom-muted uppercase mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-white placeholder:text-hosteloom-muted/50 focus:outline-none focus:border-hosteloom-accent transition-colors text-sm"
                  required
                />
              </div>

                <div>
                  <label className="block text-xs font-heading tracking-widest text-hosteloom-muted uppercase mb-1">Password</label>
                  <PasswordInput
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="py-3"
                  />
                </div>

              <div>
                 <label className="block text-xs font-heading tracking-widest text-hosteloom-muted uppercase mb-1">Select Hostel</label>
                 <select
                   name="hostelId"
                   value={formData.hostelId}
                   onChange={handleChange}
                   className="w-full bg-hosteloom-bg border border-hosteloom-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-hosteloom-accent transition-colors text-sm appearance-none"
                   required
                 >
                   <option value="" disabled className="bg-hosteloom-surface">Choose a hostel</option>
                   {hostels.map(hostel => (
                     <option key={hostel.id} value={hostel.id} className="bg-hosteloom-surface">
                       {hostel.name}
                     </option>
                   ))}
                 </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={adminsLoading}
                  className="w-full bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest rounded-xl py-4 hover:bg-hosteloom-accent/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {adminsLoading && <Loader className="text-current" size={16} />}
                  {adminsLoading ? 'Creating...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
