interface StatCardProps {
  title: string;
  value: number | string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-card-bg px-4 py-3 md:p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
      <p className="text-xs md:text-sm text-subtext-text mb-1 md:mb-2 leading-tight font-bold md:font-normal">
        <span className="md:hidden">{title}</span>
        <span className="hidden md:inline">{title === 'Total' ? 'Total de inscrições' : title}</span>
      </p>
      <p className="text-2xl md:text-3xl font-bold text-title-text">{value}</p>
    </div>
  );
}