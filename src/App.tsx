import { Header } from './assets/components/Header';
import { useInscricoes } from './hooks/useInscricoes';
import { CadastrarForm } from './assets/components/CadastrarForm';
import { StatCard } from './assets/components/StatCard';
import { InscricoesList } from './assets/components/InscricoesList';
import { useState } from 'react';
import { ImportarCsvModal } from './assets/components/ImportarCsvModal';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const cenario = searchParams.get('cenario') || undefined;

  const { data: inscricoes, isPending, isError, error, refetch } = useInscricoes(cenario);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  if (isPending) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <p className="text-title font-medium animate-pulse text-title-text">Carregando inscrições...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-body-bg flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-bold">Erro ao carregar: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-btn-primary-bg text-btn-primary-text rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const total = inscricoes?.length || 0;
  const pendentes = inscricoes?.filter(i => i.status === 'pendente').length || 0;
  const aprovadas = inscricoes?.filter(i => i.status === 'aprovado').length || 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-body-bg font-sans pb-12">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-14 lg:px-38 pt-5 md:pt-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-title font-bold text-title-text mb-0 md:mb-2 leading-none md:leading-[46px]">
              Inscrições
            </h2>
            <p className="text-subtitle text-subtitle-text leading-normal mt-1 md:mt-0">
              Campanha Conexão Ateliê
              <span className="hidden md:inline">. Acompanhe as inscrições e cadastre novos participantes.</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
            <StatCard title="Total" value={total} />
            <StatCard title="Pendentes" value={pendentes} />
            <StatCard title="Aprovadas" value={aprovadas} />
          </div>

          <div className="grid grid-cols-1 min-[1351px]:grid-cols-3 gap-6">
            <div className="min-[1351px]:col-span-2 min-w-0">
              <InscricoesList inscricoes={inscricoes || []} />
            </div>
            
            <div className="min-[1351px]:col-span-1 flex flex-col gap-4">
              <CadastrarForm />
              
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium text-title-text hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-btn-primary-bg focus:outline-none"
              >
                Importar CSV
              </button>
            </div>
          </div>
        </div>
      </main>
      {isCsvModalOpen && (
        <ImportarCsvModal onClose={() => setIsCsvModalOpen(false)} />
      )}
    </>
  );
}

export default App;