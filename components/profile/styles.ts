export const inputClass =
  'w-full bg-transparent border border-hosteloom-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-hosteloom-muted focus:outline-none focus:border-hosteloom-accent focus:bg-hosteloom-surface/50 transition-all font-body text-sm';

export const labelClass =
  'block text-xs font-heading font-medium text-hosteloom-muted uppercase tracking-widest mb-2';

export const submitButtonClass = (disabled: boolean) =>
  `flex items-center gap-2 px-8 py-3.5 font-heading font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
    disabled
      ? 'bg-hosteloom-surface-light text-hosteloom-muted border border-hosteloom-border cursor-not-allowed'
      : 'bg-white text-black hover:bg-hosteloom-accent hover:text-white cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
  }`;
