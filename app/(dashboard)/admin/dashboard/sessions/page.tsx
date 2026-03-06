"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MdAdd, MdDateRange, MdCheckCircle, MdRefresh } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionsStore } from '@/store';
import CreateSessionModal from '@/components/sessions/CreateSessionModal';

export default function SessionsPage() {
  const {
    sessions, sessionsLoading, sessionsError,
    fetchSessions, createSession, activateSession,
  } = useSessionsStore();

  const [showCreate, setShowCreate] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (sessionsError) {
      toast.error(sessionsError);
    }
  }, [sessionsError]);

  const handleCreateSession = async (payload: Parameters<typeof createSession>[0]) => {
    const ok = await createSession(payload);
    if (ok) toast.success(`Session ${payload.name} created`);
    else toast.error('Failed to create session');
    return ok;
  };

  const handleActivate = async (id: string, name: string) => {
    setActivatingId(id);
    const ok = await activateSession(id);
    setActivatingId(null);
    if (ok) toast.success(`Session ${name} activated successfully`);
    else toast.error('Failed to activate session');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-hosteloom-muted text-sm font-body mb-1 uppercase tracking-widest font-medium">Admin</p>
          <h1 className="font-heading text-3xl font-bold">Academic Sessions</h1>
          <p className="text-hosteloom-muted font-body text-sm mt-1">
            Manage academic sessions for hostel allocations.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-hosteloom-accent hover:bg-hosteloom-accent/80 transition-all text-sm font-heading font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            <MdAdd className="w-4 h-4" /> Create Session
          </button>
          <button
            onClick={() => fetchSessions()}
            disabled={sessionsLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-hosteloom-border text-hosteloom-muted hover:text-white hover:border-hosteloom-accent transition-all text-sm font-heading"
          >
            <MdRefresh className={`w-4 h-4 ${sessionsLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>



      {/* Loading skeleton */}
      {sessionsLoading && sessions.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-hosteloom-surface border border-hosteloom-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!sessionsLoading && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-hosteloom-surface border border-hosteloom-border flex items-center justify-center">
            <MdDateRange className="w-6 h-6 text-hosteloom-muted" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white">No sessions found</p>
            <p className="text-hosteloom-muted text-sm mt-1">Create an academic session to get started.</p>
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence initial={false}>
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={`bg-hosteloom-surface border rounded-2xl p-5 space-y-4 transition-all pb-6 ${
                  session.isActive
                    ? 'border-hosteloom-accent shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                    : 'border-hosteloom-border hover:border-hosteloom-accent/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      session.isActive ? 'bg-hosteloom-accent/20' : 'bg-hosteloom-bg border border-hosteloom-border'
                    }`}>
                      <MdDateRange className={`w-6 h-6 ${session.isActive ? 'text-hosteloom-accent' : 'text-hosteloom-muted'}`} />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-lg text-white">{session.name}</p>
                      <p className="text-xs text-hosteloom-muted">
                        Created {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-hosteloom-border/50 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-heading font-bold uppercase tracking-widest ${
                    session.isActive
                      ? 'bg-hosteloom-accent/15 text-hosteloom-accent border-hosteloom-accent/30'
                      : 'bg-hosteloom-bg text-hosteloom-muted border-hosteloom-border'
                  }`}>
                    {session.isActive ? 'Active' : 'Inactive'}
                  </span>

                  {!session.isActive && (
                    <button
                      onClick={() => handleActivate(session.id, session.name)}
                      disabled={activatingId === session.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hosteloom-border text-xs font-heading font-medium text-hosteloom-muted hover:text-white hover:border-hosteloom-accent/50 hover:bg-hosteloom-accent/10 transition-all disabled:opacity-50"
                    >
                      <MdCheckCircle className="w-4 h-4" />
                      {activatingId === session.id ? 'Activating…' : 'Activate'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <CreateSessionModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateSession}
      />
    </div>
  );
}
