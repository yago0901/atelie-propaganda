import { useState } from 'react';
import IconeSeta from '../../images/Seta.svg';
import { StatusBadge } from './StatusBadge';
import { InscricoesToolbar } from './InscricoesToolbar';
import { ModalDetalhes } from './ModalDetalhes';
import type { Inscricao } from '../../schemas/inscricaoSchema';

interface InscricoesListProps {
  inscricoes: Inscricao[];
}

export function InscricoesList({ inscricoes }: InscricoesListProps) {
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [idSelecionado, setIdSelecionado] = useState<string | number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const listaFiltrada = inscricoes?.filter(inscricao => {
    const matchBusca = inscricao.nome.toLowerCase().includes(busca.toLowerCase()) ||
      inscricao.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroAtivo === 'todos' || inscricao.status === filtroAtivo;
    return matchBusca && matchStatus;
  }) || [];

  const temFiltroAtivo = busca.length > 0 || filtroAtivo !== 'todos';

  const mensagemVazia = temFiltroAtivo
    ? 'Nenhuma inscrição encontrada com os filtros atuais.'
    : 'Ainda não há inscrições cadastradas.';

  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const listaPaginada = listaFiltrada.slice(indexInicial, indexInicial + itensPorPagina);

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  return (
    <div className="flex flex-col min-[1351px]:bg-card-bg min-[1351px]:rounded-lg min-[1351px]:border min-[1351px]:border-gray-200">
      <InscricoesToolbar 
        busca={busca} 
        setBusca={(e) => { setBusca(e); setPaginaAtual(1); }} 
        filtroAtivo={filtroAtivo} 
        setFiltroAtivo={(e) => { setFiltroAtivo(e); setPaginaAtual(1); }} 
      />

      <div className="rounded-lg min-[1351px]:border-none border border-gray-200 overflow-hidden">
        <div className="px-4 py-1 text-[12px] text-subtext-text border-b border-gray-100">
          Mostrando {listaPaginada.length} de {listaFiltrada.length} inscrições
        </div>

        <div className="hidden min-[1351px]:block w-full overflow-x-auto">
          {listaFiltrada.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-subtext-text uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-xs font-semibold text-subtext-text uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-3 text-xs font-semibold text-subtext-text uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-xs font-semibold text-subtext-text uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listaPaginada.map((inscricao) => (
                  <tr key={inscricao.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-title-text whitespace-nowrap max-w-[180px] truncate">{inscricao.nome}</td>
                    <td className="px-6 py-4 text-sm text-subtext-text whitespace-nowrap max-w-[150px] truncate">{inscricao.email}</td>
                    <td className="px-6 py-4 text-sm text-subtext-text whitespace-nowrap">
                      {new Date(inscricao.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-2 py-4"><StatusBadge status={inscricao.status} /></td>
                    <td className="px-2 py-4 text-right min-[1351px]:px-4">
                      <button
                        onClick={() => setIdSelecionado(inscricao.id)}
                        aria-label={`Ver detalhes de ${inscricao.nome}`}
                        className="text-sm font-medium text-title-text hover:underline flex items-center gap-2 justify-end w-full whitespace-nowrap focus:ring-2 focus:ring-btn-primary-bg focus:outline-none rounded"
                      >
                        Ver detalhes
                        <img src={IconeSeta} alt="" className="w-4 h-4 opacity-50" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-subtext-text">
              {mensagemVazia}
            </div>
          )}
        </div>

        <div className="min-[1351px]:hidden flex flex-col divide-y divide-gray-100 bg-card-bg">
          {listaPaginada.length > 0 ? (
            listaPaginada.map((inscricao) => (
              <div key={inscricao.id} className="py-2 px-4 flex flex-col">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-sm font-bold text-title-text leading-tight truncate">{inscricao.nome}</span>
                  <span className="mr-5 leading-none"><StatusBadge status={inscricao.status} /></span>
                </div>
                <div className="flex justify-between items-center gap-2 mt-0.5">
                  <span className="text-sm text-subtext-text truncate">{inscricao.email}</span>
                  <button 
                    onClick={() => setIdSelecionado(inscricao.id)} 
                    aria-label={`Ver detalhes de ${inscricao.nome}`}
                    className="p-1 -mr-1 shrink-0 focus:ring-2 focus:ring-btn-primary-bg focus:outline-none rounded"
                  >
                    <img src={IconeSeta} alt="" className="w-4 h-4 opacity-50" />
                  </button>
                </div>
                <div className="text-xs text-subtext-text">
                  {new Date(inscricao.criadoEm).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-subtext-text">
              {mensagemVazia}
            </div>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/30">
            <span className="text-sm text-subtext-text">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 1}
                className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-btn-primary-bg focus:outline-none"
              >
                Anterior
              </button>
              <button
                onClick={handleProximaPagina}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-btn-primary-bg focus:outline-none"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalDetalhes inscricaoId={idSelecionado} onClose={() => setIdSelecionado(null)} />
    </div>
  );
}