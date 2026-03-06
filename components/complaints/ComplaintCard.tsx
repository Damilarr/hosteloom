import type { Complaint } from '@/types';
import { MdAccessTime } from 'react-icons/md';

const statusClass: Record<string, string> = {
  PENDING:     'bg-yellow-400/15 text-yellow-400',
  IN_PROGRESS: 'bg-blue-400/15 text-blue-400',
  RESOLVED:    'bg-green-400/15 text-green-400',
};

const categoryClass: Record<string, string> = {
  SECURITY:    'bg-red-400/10 text-red-300',
  MAINTENANCE: 'bg-orange-400/10 text-orange-300',
  NOISE:       'bg-yellow-400/10 text-yellow-300',
  OTHER:       'bg-hosteloom-muted/10 text-hosteloom-muted',
};

interface Props {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: Props) {
  const date = new Date(complaint.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-hosteloom-surface border border-hosteloom-border hover:border-hosteloom-accent/40 rounded-2xl px-5 py-4 space-y-3 transition-all">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="font-heading font-semibold text-white text-sm">{complaint.title}</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-heading font-bold uppercase tracking-widest ${categoryClass[complaint.category] ?? categoryClass.OTHER}`}>
            {complaint.category}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-heading font-bold uppercase tracking-widest ${statusClass[complaint.status]}`}>
            {complaint.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <p className="text-xs text-hosteloom-muted leading-relaxed line-clamp-2">{complaint.description}</p>

      <div className="flex items-center gap-1.5 text-[11px] text-hosteloom-muted">
        <MdAccessTime className="w-3 h-3" />
        <span>{date}</span>
      </div>
    </div>
  );
}
