import type { AdminComplaint, ComplaintStatus } from '@/types';
import { MdAccessTime } from 'react-icons/md';

const statusOptions: ComplaintStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

const statusClass: Record<ComplaintStatus, string> = {
  PENDING:     'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
  IN_PROGRESS: 'bg-blue-400/15 text-blue-400 border-blue-400/30',
  RESOLVED:    'bg-green-400/15 text-green-400 border-green-400/30',
};

const selectClass: Record<ComplaintStatus, string> = {
  PENDING:     'text-yellow-400',
  IN_PROGRESS: 'text-blue-400',
  RESOLVED:    'text-green-400',
};

interface Props {
  complaint: AdminComplaint;
  isUpdating: boolean;
  onStatusChange: (status: ComplaintStatus) => void;
}

export default function AdminComplaintRow({ complaint, isUpdating, onStatusChange }: Props) {
  const date = new Date(complaint.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="group bg-hosteloom-surface border border-hosteloom-border hover:border-hosteloom-accent/50 rounded-2xl px-5 py-4 space-y-3 transition-all">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="font-heading font-semibold text-white text-sm">{complaint.title}</p>

        <div className="relative shrink-0">
          {isUpdating ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-heading font-bold uppercase tracking-widest ${statusClass[complaint.status]}`}>
              <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              {complaint.status.replace('_', ' ')}
            </div>
          ) : (
            <select
              value={complaint.status}
              onChange={(e) => onStatusChange(e.target.value as ComplaintStatus)}
              className={`bg-hosteloom-surface-light border border-hosteloom-border rounded-xl px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-widest focus:outline-none focus:border-hosteloom-accent transition-all appearance-none cursor-pointer ${selectClass[complaint.status]}`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="text-white normal-case tracking-normal">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <p className="text-xs text-hosteloom-muted leading-relaxed line-clamp-2">{complaint.description}</p>

      <div className="flex items-center gap-3 text-[11px] text-hosteloom-muted flex-wrap">
        <span className="flex items-center gap-1">
          <MdAccessTime className="w-3 h-3" />
          {date}
        </span>
        <span>·</span>
        <span className="font-mono text-[10px] opacity-60">{complaint.userId}</span>
      </div>
    </div>
  );
}
