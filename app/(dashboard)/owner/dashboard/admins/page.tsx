"use client";

import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDelete, MdAdminPanelSettings } from 'react-icons/md';
import { useAdminsStore, useHostelsStore } from '@/store';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/Loader';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function OwnerAdminsPage() {
  const { createAdmin, adminsLoading, fetchOwnerAdmins, ownerAdmins, deleteOwnerAdmin } = useAdminsStore();
  const { hostels, fetchAllHostels } = useHostelsStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, adminId: '' });

  useEffect(() => {
    fetchAllHostels();
    fetchOwnerAdmins();
  }, [fetchAllHostels, fetchOwnerAdmins]);

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
      fetchOwnerAdmins();
    } else {
      toast.error('Failed to create admin');
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deleteOwnerAdmin(deleteModal.adminId);
    if (res) {
      toast.success('Hostel admin deleted successfully');
    } else {
      toast.error('Failed to delete admin');
    }
    setDeleteModal({ isOpen: false, adminId: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-hosteloom-accent text-[10px] font-heading font-bold uppercase tracking-widest mb-1">
            Access Control
          </p>
          <h1 className="text-3xl font-heading font-bold">Administrators</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">Manage staff access to your hostels.</p>
        </div>

        <button
          onClick={() => {
            if (hostels.length === 0) {
              toast.error('You must create a hostel first before adding an admin.');
              return;
            }
            setModalOpen(true);
          }}
          className="bg-hosteloom-accent text-white font-heading font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:bg-hosteloom-accent/80 transition-colors flex items-center gap-2 shadow-lg shadow-hosteloom-accent/20"
        >
          <MdAdd className="w-5 h-5" />
          Create Admin
        </button>
      </div>

      <div className="bg-hosteloom-surface border border-hosteloom-border rounded-2xl p-8">
        {adminsLoading && ownerAdmins.length === 0 ? (
          <div className="flex justify-center p-8"><Loader size={24} /></div>
        ) : ownerAdmins.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-hosteloom-border rounded-xl">
            <div className="w-12 h-12 bg-hosteloom-surface-light rounded-full flex items-center justify-center mx-auto mb-4 text-hosteloom-muted">
              <MdAdminPanelSettings className="w-6 h-6" />
            </div>
            <h3 className="text-white font-heading font-bold mb-2">No Admins Yet</h3>
            <p className="text-hosteloom-muted font-body text-sm mb-4">You haven't added any administrators to manage your properties.</p>
            <button
              onClick={() => {
                if (hostels.length === 0) {
                  toast.error('You must create a hostel first before adding an admin.');
                  return;
                }
                setModalOpen(true);
              }}
              className="text-hosteloom-accent font-heading text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              + Create First Admin
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="text-hosteloom-muted border-b border-hosteloom-border text-xs uppercase font-heading tracking-widest">
                <tr>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Hostel</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hosteloom-border/50">
                {ownerAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-hosteloom-surface-light transition-colors group">
                    <td className="py-4 text-white font-medium">
                      {admin.adminProfile?.firstName} {admin.adminProfile?.lastName}
                    </td>
                    <td className="py-4 text-hosteloom-muted">{admin.email}</td>
                    <td className="py-4 text-hosteloom-muted">
                      {admin.adminProfile?.hostel?.name || 'Unassigned'}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, adminId: admin.id })}
                        title="Delete Admin"
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, adminId: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Administrator"
        message="Are you sure you want to delete this administrator? This action is permanent and cannot be undone."
        confirmText="Delete Admin"
        variant="danger"
      />
    </div>
  );
}
