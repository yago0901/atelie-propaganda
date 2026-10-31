import { useState } from 'react';
import { processarCsv, type ResultadoValidacaoCsv } from '../../utils/csvValidator';

interface ImportarCsvModalProps {
  onClose: () => void;
}

export function ImportarCsvModal({ onClose }: ImportarCsvModalProps) {
  const [resultado, setResultado] = useState<ResultadoValidacaoCsv | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const dados = await processarCsv(file);
      setResultado(dados);
    } catch (error) {
      alert('Erro ao ler o arquivo CSV. Verifique o formato.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-header-bg/60 p-4 backdrop-blur-sm">
      <div className="bg-card-bg w-full max-w-4xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-title-text">Importar CSV</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1">
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!resultado ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50">
              <p className="text-title-text mb-4">Selecione o arquivo .csv</p>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                disabled={isLoading}
                className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-btn-primary-bg file:text-btn-primary-text hover:file:bg-opacity-90 cursor-pointer"
              />
              {isLoading && <p className="text-sm text-subtext-text mt-4 animate-pulse">Processando arquivo...</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Resumo */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-subtext-text">Total de Linhas</p>
                  <p className="text-2xl font-bold text-title-text">{resultado.total}</p>
                </div>
                <div className="bg-status-approved-bg p-4 rounded-lg border border-status-approved-text/20">
                  <p className="text-sm text-status-approved-text">Válidos</p>
                  <p className="text-2xl font-bold text-status-approved-text">{resultado.validos.length}</p>
                </div>
                <div className="bg-status-pending-bg p-4 rounded-lg border border-status-pending-text/20">
                  <p className="text-sm text-status-pending-text">Inválidos</p>
                  <p className="text-2xl font-bold text-status-pending-text">{resultado.invalidos.length}</p>
                </div>
              </div>

              {/* Prévia */}
              <div>
                <h4 className="font-semibold text-title-text mb-2">Prévia dos Dados</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-2 text-xs font-semibold text-subtext-text">Status</th>
                        <th className="px-4 py-2 text-xs font-semibold text-subtext-text">Nome</th>
                        <th className="px-4 py-2 text-xs font-semibold text-subtext-text">E-mail</th>
                        <th className="px-4 py-2 text-xs font-semibold text-subtext-text">Origem</th>
                        <th className="px-4 py-2 text-xs font-semibold text-subtext-text">Erros</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* Linhas Válidas */}
                      {resultado.validos.map((linha, index) => (
                        <tr key={`v-${index}`} className="bg-white">
                          <td className="px-4 py-2 text-xs font-medium text-status-approved-text">OK</td>
                          <td className="px-4 py-2 text-sm text-title-text">{linha.nome}</td>
                          <td className="px-4 py-2 text-sm text-subtext-text">{linha.email}</td>
                          <td className="px-4 py-2 text-sm text-subtext-text">{linha.origem}</td>
                          <td className="px-4 py-2 text-xs text-subtext-text">-</td>
                        </tr>
                      ))}
                      {/* Linhas Inválidas */}
                      {resultado.invalidos.map((linha, index) => (
                        <tr key={`i-${index}`} className="bg-red-50/30">
                          <td className="px-4 py-2 text-xs font-medium text-red-500">Erro</td>
                          <td className="px-4 py-2 text-sm text-title-text">{linha.nome || '-'}</td>
                          <td className="px-4 py-2 text-sm text-subtext-text">{linha.email || '-'}</td>
                          <td className="px-4 py-2 text-sm text-subtext-text">{linha.origem || '-'}</td>
                          <td className="px-4 py-2 text-xs text-red-500">{linha.erros.join(' | ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          {resultado && (
            <button 
              onClick={() => setResultado(null)} 
              className="px-4 py-2 text-sm font-medium text-title-text bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Escolher outro arquivo
            </button>
          )}
          <button onClick={onClose} className="px-6 py-2 bg-btn-primary-bg text-btn-primary-text rounded-md text-sm font-medium hover:opacity-90">
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}