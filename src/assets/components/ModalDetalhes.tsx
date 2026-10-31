import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { StatusBadge } from './StatusBadge';

interface ModalDetalhesProps {
  inscricaoId: string | number | null;
  onClose: () => void;
}

export function ModalDetalhes({ inscricaoId, onClose }: ModalDetalhesProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!inscricaoId) return;

    triggerRef.current = document.activeElement as HTMLElement;
    
    setTimeout(() => closeButtonRef.current?.focus(), 50);
    
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusables.length === 0) return;

        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modalRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      if (triggerRef.current) triggerRef.current.focus();
    };
  }, [inscricaoId, onClose]);

  const { data: detalhes, isPending, isError } = useQuery({
    queryKey: ['inscricaoDetalhes', inscricaoId],
    queryFn: async () => {
      const response = await api.get(`/inscricoes/${inscricaoId}`);
      return response.data;
    },
    enabled: !!inscricaoId,
  });

  if (!inscricaoId) return null;

  const formatarDataHora = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' +
      data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-header-bg/60 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        tabIndex={-1}
        className="bg-card-bg w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col outline-none"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 id="titulo-modal" className="text-lg font-bold text-title-text">Detalhes da inscrição</h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            aria-label="Fechar modal" 
            className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1 rounded focus:ring-2 focus:ring-btn-primary-bg focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {isPending ? (
            <div className="flex justify-center py-8">
              <p className="text-subtext-text animate-pulse">Carregando detalhes...</p>
            </div>
          ) : isError ? (
            <div className="text-red-500 text-center py-8">
              Erro ao carregar os detalhes.
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3">
                <span className="text-subtext-text col-span-1">Nome</span>
                <span className="text-title-text font-medium col-span-2">{detalhes.nome}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3">
                <span className="text-subtext-text col-span-1">E-mail</span>
                <span className="text-title-text col-span-2">{detalhes.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3">
                <span className="text-subtext-text col-span-1">Origem do cadastro</span>
                <span className="text-title-text col-span-2 capitalize">{detalhes.origem}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3 items-center">
                <span className="text-subtext-text col-span-1">Status</span>
                <div className="col-span-2"><StatusBadge status={detalhes.status} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3">
                <span className="text-subtext-text col-span-1">Data da inscrição</span>
                <span className="text-title-text col-span-2">{formatarDataHora(detalhes.criadoEm)}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-subtext-text col-span-1">Código</span>
                <span className="text-title-text col-span-2">{detalhes.id}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-title-text hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-btn-primary-bg focus:outline-none"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}