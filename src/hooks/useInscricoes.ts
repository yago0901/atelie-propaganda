import { useQuery } from '@tanstack/react-query';
import { inscricoesListSchema } from '../schemas/inscricaoSchema';
import { api } from '../services/api'; 

export function useInscricoes(cenario?: string) {
  return useQuery({
    queryKey: ['inscricoes', cenario], 
    queryFn: async () => {

      const response = await api.get('/inscricoes', {
        params: { cenario },
      });
      
      const inscricoesValidadas = inscricoesListSchema.parse(response.data);
      
      return inscricoesValidadas;
    },
  });
}