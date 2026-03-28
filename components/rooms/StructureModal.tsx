"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiFolder, FiBox, FiLayers, FiGrid, FiTag, FiInfo, FiActivity, FiPlus, FiList } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";
import { inputClass, labelClass, submitButtonClass } from "@/components/profile/styles";
import { Loader } from "@/components/ui/Loader";

interface StructureModalProps {
  creatingType: "hostel" | "block" | "floor" | "room" | "bulk-rooms" | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  isSubmitting: boolean;
}

export default function StructureModal({
  creatingType,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
}: StructureModalProps) {
  const [facilityInput, setFacilityInput] = useState("");

  const handleAddFacility = () => {
    if (facilityInput.trim()) {
      const newItems = facilityInput.split(',').map(f => f.trim()).filter(Boolean);
      if (newItems.length > 0) {
        setFormData({
          ...formData,
          facilities: [...(formData.facilities || []), ...newItems]
        });
        setFacilityInput("");
      }
    }
  };

  const handleRemoveFacility = (index: number) => {
    const newFacilities = [...(formData.facilities || [])];
    newFacilities.splice(index, 1);
    setFormData({ ...formData, facilities: newFacilities });
  };

  return (
    <AnimatePresence>
      {creatingType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-hosteloom-bg/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-hosteloom-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-hosteloom-border p-1"
          >
            <div className="bg-hosteloom-bg/50 rounded-[inherit] overflow-hidden">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent">
                    {creatingType === "hostel" ? <FiFolder /> :
                     creatingType === "block" ? <FiBox /> :
                     creatingType === "floor" ? <FiLayers /> : <FiGrid />}
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold tracking-tight">
                      {creatingType === "bulk-rooms" ? "Bulk Add Rooms" : `New ${creatingType}`}
                    </h2>
                    <p className="text-[10px] text-hosteloom-muted font-heading font-bold uppercase tracking-widest">Property Configuration</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-hosteloom-muted hover:text-white hover:bg-hosteloom-surface-light transition-all"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={onSubmit} className="p-8 pt-6 space-y-6">
                {creatingType === "hostel" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Hostel Name</label>
                      <div className="relative group">
                        <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                        <input required type="text" placeholder="e.g. Royal Pride" className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Short Description</label>
                      <div className="relative group">
                        <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                        <input required type="text" placeholder="e.g. Luxury student hostel" className={inputClass} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Full Address</label>
                      <div className="relative group">
                        <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                        <input required type="text" placeholder="Location details..." className={inputClass} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Min Room Price (₦)</label>
                        <div className="relative group">
                          <TbCurrencyNaira className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors text-lg" />
                          <input type="number" placeholder="50000" className={`${inputClass} !pl-10`} value={formData.priceRangeMin || ''} onChange={e => setFormData({...formData, priceRangeMin: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Max Room Price (₦)</label>
                        <div className="relative group">
                          <TbCurrencyNaira className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors text-lg" />
                          <input type="number" placeholder="120000" className={`${inputClass} !pl-10`} value={formData.priceRangeMax || ''} onChange={e => setFormData({...formData, priceRangeMax: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className={`${labelClass} !mb-0`}>Facilities</label>
                        <div className="group/tooltip relative flex items-center">
                          <FiInfo className="w-4 h-4 text-hosteloom-muted hover:text-white transition-colors cursor-help" />
                          <div className="absolute left-1/2 -top-2 -translate-y-full -translate-x-1/2 w-48 p-2 bg-hosteloom-surface-light border border-hosteloom-border rounded-lg text-xs font-body leading-tight text-hosteloom-text opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-center shadow-xl z-50 pointer-events-none">
                            Add as many facilities as possible. Type a comma (,) or press Enter to add each facility.
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-hosteloom-surface-light border-b border-r border-hosteloom-border rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <div className="relative group flex-1">
                          <FiList className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                          <input 
                            type="text" 
                            placeholder="e.g. WiFi, 24/7 Power..." 
                            className={inputClass} 
                            value={facilityInput} 
                            onChange={e => setFacilityInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                handleAddFacility();
                              }
                            }}
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={handleAddFacility}
                          className="w-12 rounded-xl bg-hosteloom-surface-light border border-hosteloom-border flex items-center justify-center text-white hover:bg-hosteloom-accent transition-colors"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      {formData.facilities && formData.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.facilities.map((fac: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-hosteloom-surface-light border border-hosteloom-border rounded-full px-3 py-1 text-xs text-hosteloom-text">
                              <span>{fac}</span>
                              <button type="button" onClick={() => handleRemoveFacility(idx)} className="text-hosteloom-muted hover:text-hosteloom-secondary">
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {creatingType === "block" && (
                  <div>
                    <label className={labelClass}>Block Identification</label>
                    <div className="relative group">
                      <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                      <input required type="text" placeholder="e.g. Block A" className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>
                )}

                {creatingType === "floor" && (
                  <div>
                    <label className={labelClass}>Floor Label</label>
                    <div className="relative group">
                      <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                      <input required type="text" placeholder="e.g. Ground Floor" className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>
                )}

                {creatingType === "room" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Room ID / Number</label>
                      <div className="relative group">
                        <FiGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                        <input required type="text" placeholder="e.g. R1" className={inputClass} value={formData.roomNumber || ''} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Capacity</label>
                        <div className="relative group">
                          <FiActivity className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors" />
                          <input required type="number" placeholder="4" className={inputClass} value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Price (₦)</label>
                        <div className="relative group">
                          <TbCurrencyNaira className="absolute left-4 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors text-lg" />
                          <input required type="number" placeholder="250000" className={`${inputClass} !pl-10`} value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {creatingType === "bulk-rooms" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className={labelClass}>Prefix</label>
                        <input required type="text" placeholder="A" className={`${inputClass} !pl-4`} value={formData.prefix || ''} onChange={e => setFormData({...formData, prefix: e.target.value})} />
                      </div>
                      <div className="col-span-1">
                        <label className={labelClass}>Start</label>
                        <input required type="number" placeholder="1" className={`${inputClass} !pl-4`} value={formData.start || ''} onChange={e => setFormData({...formData, start: e.target.value})} />
                      </div>
                      <div className="col-span-1">
                        <label className={labelClass}>End</label>
                        <input required type="number" placeholder="20" className={`${inputClass} !pl-4`} value={formData.end || ''} onChange={e => setFormData({...formData, end: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Capacity</label>
                        <input required type="number" placeholder="4" className={`${inputClass} !pl-4`} value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                      </div>
                      <div>
                        <label className={labelClass}>Price (₦)</label>
                        <div className="relative group">
                          <TbCurrencyNaira className="absolute left-3 top-1/2 -translate-y-1/2 text-hosteloom-muted group-focus-within:text-white transition-colors text-lg" />
                          <input required type="number" placeholder="150000" className={`${inputClass} !pl-10`} value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className={submitButtonClass(isSubmitting)}>
                    {isSubmitting && <Loader className="text-current" size={16} />}
                    {isSubmitting ? "Processing…" : `Create ${creatingType?.split("-")[0]}`}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
