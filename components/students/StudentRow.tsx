import type { StudentRecord } from '@/types';
import { MdCheckCircle, MdCancel, MdDelete, MdSchool } from 'react-icons/md';

const statusClass: Record<string, string> = {
  PENDING:  'bg-yellow-400/15 text-yellow-400',
  APPROVED: 'bg-green-400/15 text-green-400',
  REJECTED: 'bg-red-400/15 text-red-400',
};

interface Props {
  student: StudentRecord;
  isProcessing: boolean;
  onDelete: () => void;
}

export default function StudentRow({ student, isProcessing, onDelete }: Props) {
  const isPending = student.registrationStatus === 'PENDING';

  return (
    <div className="group bg-hosteloom-surface border border-hosteloom-border hover:border-hosteloom-accent/50 rounded-2xl px-5 py-4 flex items-center gap-4 transition-all">

      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-hosteloom-accent/15 flex items-center justify-center shrink-0">
        <span className="font-heading font-bold text-hosteloom-accent text-sm">
          {student.firstName[0]}{student.lastName[0]}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-heading font-semibold text-white text-sm truncate">
            {student.firstName} {student.lastName}
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-heading font-bold uppercase tracking-widest bg-green-400/10 text-green-400">
            {student.registrationStatus}
          </span>
        </div>
        <p className="text-xs text-hosteloom-muted truncate">{student.user.email}</p>
        <div className="flex items-center gap-3 text-[11px] text-hosteloom-muted mt-1 flex-wrap">
          <span className="flex items-center gap-1">
            <MdSchool className="w-3 h-3" />
            {student.school}
          </span>
          <span>·</span>
          <span>{student.matricNo}</span>
          <span>·</span>
          <span>{student.academicLevel} Level</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDelete}
          disabled={isProcessing}
          title="Delete student"
          className="p-2 text-hosteloom-muted hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all"
        >
          <MdDelete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
