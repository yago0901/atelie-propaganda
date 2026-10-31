interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPendente = status === 'pendente';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize
      ${isPendente ? 'bg-status-pending-bg text-status-pending-text' : 'bg-status-approved-bg text-status-approved-text'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPendente ? 'bg-status-pending-text' : 'bg-status-approved-text'}`} />
      {status}
    </span>
  );
}