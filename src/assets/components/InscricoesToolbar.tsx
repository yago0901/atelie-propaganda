import IconeLupa from '../../images/Lupa.svg';

interface InscricoesToolbarProps {
  busca: string;
  setBusca: (busca: string) => void;
  filtroAtivo: string;
  setFiltroAtivo: (filtro: string) => void;
}

export function InscricoesToolbar({ busca, setBusca, filtroAtivo, setFiltroAtivo }: InscricoesToolbarProps) {
  return (
    <div className="flex flex-col min-[1351px]:flex-row gap-4 items-start min-[1351px]:items-center justify-between">
      <div className="relative w-full min-[1351px]:w-96 min-[1351px]:p-4">
        <img
          src={IconeLupa}
          alt=""
          className="absolute left-3 min-[1351px]:left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail"
          aria-label="Buscar por nome ou e-mail"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full h-9 pl-9 pr-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-btn-primary-bg focus:ring-2 focus:ring-btn-primary-bg transition-colors"
        />
      </div>

      <div className="flex bg-[#F8F9F7] border border-[#E6E9E7] mb-4 p-1 rounded-lg w-full min-[1351px]:w-auto min-[1351px]:mr-4">
        {['todos', 'pendente', 'aprovado'].map((filtro) => (
          <button
            key={filtro}
            onClick={() => setFiltroAtivo(filtro)}
            aria-pressed={filtroAtivo === filtro}
            className={`flex-1 min-[1351px]:flex-none px-6 py-1 rounded-md text-subtitle font-medium whitespace-nowrap transition-colors text-center focus:ring-2 focus:ring-btn-primary-bg focus:outline-none ${
              filtroAtivo === filtro
                ? 'bg-btn-primary-bg text-btn-primary-text shadow-sm'
                : 'text-subtext-text hover:text-title-text'
            }`}
          >
            {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}