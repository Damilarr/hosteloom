import type { UserProfile } from '@/types';

interface Props {
  profile: UserProfile | null;
}

export default function StatusBanner({ profile }: Props) {
  if (!profile) return null;

  const status = profile.registrationStatus;

  const containerClass =
    status === 'APPROVED'
      ? 'bg-green-500/10 border-green-500/30'
      : status === 'REJECTED'
      ? 'bg-red-500/10 border-red-500/30'
      : 'bg-hosteloom-accent/10 border-hosteloom-accent/30';

  const dotClass =
    status === 'APPROVED' ? 'bg-green-400'
    : status === 'REJECTED' ? 'bg-red-400'
    : 'bg-hosteloom-accent';

  const badgeClass =
    status === 'APPROVED'
      ? 'bg-green-400/20 text-green-400'
      : status === 'REJECTED'
      ? 'bg-red-400/20 text-red-400'
      : 'bg-yellow-400/20 text-yellow-400';

  const message =
    status === 'APPROVED'
      ? 'Your registration has been approved. You can now apply for a room.'
      : status === 'REJECTED'
      ? `Your registration was rejected. ${
          profile.rejectionReason
            ? `Reason: ${profile.rejectionReason}`
            : 'Contact your hostel admin for details.'
        }`
      : "Your profile is under review. You'll be notified once approved.";

  return (
    <div className={`flex items-start gap-4 rounded-2xl px-5 py-4 border ${containerClass}`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotClass}`} />
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-heading font-semibold text-white">Registration status</p>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-heading font-bold uppercase tracking-widest ${badgeClass}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-hosteloom-muted">{message}</p>
      </div>
    </div>
  );
}
