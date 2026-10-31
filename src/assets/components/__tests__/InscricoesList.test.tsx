import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InscricoesList } from '../InscricoesList';
import { describe, it, expect } from 'vitest';
import type { Inscricao } from '../../../schemas/inscricaoSchema';

const queryClient = new QueryClient();

const mockInscricoes: Inscricao[] = [
  {
    id: '1',
    nome: 'Marina Albuquerque',
    email: 'marina@teste.com',
    origem: 'evento',
    status: 'pendente',
    criadoEm: '2026-10-14T09:12:00Z'
  },
  {
    id: '2',
    nome: 'Rafael Tanaka',
    email: 'rafael@teste.com',
    origem: 'site',
    status: 'aprovado',
    criadoEm: '2026-10-14T10:00:00Z'
  },
];

describe('InscricoesList', () => {
  it('deve renderizar a lista e filtrar pela busca', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <InscricoesList inscricoes={mockInscricoes} total={2} />
      </QueryClientProvider>
    );

    expect(screen.getAllByText('Marina Albuquerque')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Rafael Tanaka')[0]).toBeInTheDocument();

    const inputBusca = screen.getByLabelText(/Buscar por nome ou e-mail/i);
    await userEvent.type(inputBusca, 'Marina');

    expect(screen.getAllByText('Marina Albuquerque')[0]).toBeInTheDocument();
    expect(screen.queryByText('Rafael Tanaka')).not.toBeInTheDocument();

    await userEvent.clear(inputBusca);
    await userEvent.type(inputBusca, 'Inexistente');

    expect(screen.getAllByText(/Nenhuma inscrição encontrada com os filtros atuais/i)[0]).toBeInTheDocument();
  });
});