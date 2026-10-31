import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CadastrarForm } from '../CadastrarForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiModule from '../../../services/api';

vi.mock('../../../services/api', () => ({
  api: { post: vi.fn() }
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <CadastrarForm />
    </QueryClientProvider>
  );
};

describe('CadastrarForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir mensagens de erro ao tentar enviar vazio', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /cadastrar participante/i }));
    expect(await screen.findByText(/O nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
    expect(await screen.findByText(/Formato de e-mail inválido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Selecione uma origem/i)).toBeInTheDocument();
  });

  it('deve enviar os dados e limpar o formulário em caso de sucesso', async () => {
    vi.mocked(apiModule.api.post).mockResolvedValueOnce({ data: {} });

    renderComponent();
    await userEvent.type(screen.getByLabelText(/Nome completo/i), 'João Silva');
    await userEvent.type(screen.getByLabelText(/E-mail/i), 'joao@teste.com');
    await userEvent.selectOptions(screen.getByLabelText(/Origem/i), 'evento');

    await userEvent.click(screen.getByRole('button', { name: /cadastrar participante/i }));

    await waitFor(() => {
      expect(apiModule.api.post).toHaveBeenCalledWith('/inscricoes', {
        nome: 'João Silva',
        email: 'joao@teste.com',
        origem: 'evento'
      });
    });

    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
  });

  it('deve exibir erro e manter os dados preenchidos se o e-mail já existir (409)', async () => {
    vi.mocked(apiModule.api.post).mockRejectedValueOnce({ response: { status: 409 } });

    renderComponent();
    await userEvent.type(screen.getByLabelText(/Nome completo/i), 'João Silva');
    await userEvent.type(screen.getByLabelText(/E-mail/i), 'joao@teste.com');
    await userEvent.selectOptions(screen.getByLabelText(/Origem/i), 'evento');

    await userEvent.click(screen.getByRole('button', { name: /cadastrar participante/i }));

    expect(await screen.findByText(/Este e-mail já está cadastrado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('João Silva');
    expect(screen.getByLabelText(/E-mail/i)).toHaveValue('joao@teste.com');
  });

  it('deve exibir erro ao inserir e-mail com formato inválido', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText(/Nome completo/i), 'João Silva');
    await userEvent.type(screen.getByLabelText(/E-mail/i), 'email-invalido');
    await userEvent.selectOptions(screen.getByLabelText(/Origem/i), 'evento');

    await userEvent.click(screen.getByRole('button', { name: /cadastrar participante/i }));

    expect(await screen.findByText(/Formato de e-mail inválido/i)).toBeInTheDocument();
    expect(apiModule.api.post).not.toHaveBeenCalled();
  });
});