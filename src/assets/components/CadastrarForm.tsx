import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../../services/api';
import { cadastroFormSchema, type CadastroFormData } from '../../schemas/inscricaoSchema';
import IconeSetaBaixo from '../../images/SetaBaixo.svg';

export function CadastrarForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroFormSchema),
  });

  const searchParams = new URLSearchParams(window.location.search);
  const cenario = searchParams.get('cenario');

  const mutation = useMutation({
    mutationFn: async (dadosParticipante: CadastroFormData) => {
      const response = await api.post(`/inscricoes${cenario ? `?cenario=${cenario}` : ''}`, dadosParticipante);
      return response.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['inscricoes'] });
      alert('Participante cadastrado com sucesso!');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        setError('email', { type: 'manual', message: 'Este e-mail já está cadastrado.' });
      } else {
        alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
    }
  });

  const onSubmit = (data: CadastroFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-card-bg p-4 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-title-text tracking-[0.1px]">Cadastrar participante</h3>
        <p className="text-[11px] text-subtext-text">Todos os campos são obrigatórios.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-title-text mb-1.5">Nome completo</label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: Marina Albuquerque"
            {...register('nome')}
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? "erro-nome" : undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 
              ${errors.nome ? 'border-red-500 focus:ring-red-500' : 'border-[#A9B1AD] focus:border-btn-primary-bg focus:ring-btn-primary-bg'}`}
          />
          {errors.nome && <span id="erro-nome" className="text-xs text-red-500 mt-1 block">{errors.nome.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-title-text mb-1.5">E-mail</label>
          <input
            id="email"
            type="text"
            placeholder="nome@exemplo.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "erro-email" : undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 
              ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#A9B1AD] focus:border-btn-primary-bg focus:ring-btn-primary-bg'}`}
          />
          {errors.email && <span id="erro-email" className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="origem" className="block text-sm font-medium text-title-text mb-1.5">Origem</label>
          <div className="relative">
            <select
              id="origem"
              {...register('origem')}
              defaultValue=""
              aria-invalid={!!errors.origem}
              aria-describedby={errors.origem ? "erro-origem" : undefined}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 appearance-none text-subtext-text bg-white
                ${errors.origem ? 'border-red-500 focus:ring-red-500' : 'border-[#A9B1AD] focus:border-btn-primary-bg focus:ring-btn-primary-bg'}`}
            >
              <option value="" disabled>Selecione a origem</option>
              <option value="evento">Evento</option>
              <option value="redes_sociais">Redes Sociais</option>
              <option value="site">Site</option>
            </select>
            <img
              src={IconeSetaBaixo}
              alt=""
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none"
            />
          </div>
          {errors.origem && <span id="erro-origem" className="text-xs text-red-500 mt-1 block">{errors.origem.message}</span>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-btn-primary-bg text-btn-primary-text font-medium py-2.5 rounded-md text-sm mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 focus:ring-2 focus:ring-offset-2 focus:ring-btn-primary-bg"
        >
          {mutation.isPending ? 'Cadastrando...' : 'Cadastrar participante'}
        </button>
      </form>
    </div>
  );
}