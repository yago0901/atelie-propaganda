import Papa from 'papaparse';
import { cadastroFormSchema } from '../schemas/inscricaoSchema';

export type LinhaCsv = {
  nome: string;
  email: string;
  origem: string;
};

export type ResultadoValidacaoCsv = {
  validos: LinhaCsv[];
  invalidos: (LinhaCsv & { erros: string[] })[];
  total: number;
};

export function processarCsv(arquivo: File): Promise<ResultadoValidacaoCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse(arquivo, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const validos: LinhaCsv[] = [];
        const invalidos: (LinhaCsv & { erros: string[] })[] = [];

        result.data.forEach((linha: any) => {
          const linhaNormalizada = {
            nome: linha.nome?.trim() || linha.Nome?.trim() || '',
            email: linha.email?.trim() || linha.Email?.trim() || '',
            origem: linha.origem?.trim() || linha.Origem?.trim() || '',
          };

          const validacao = cadastroFormSchema.safeParse(linhaNormalizada);

          if (validacao.success) {
            validos.push(linhaNormalizada);
          } else {
            const erros = validacao.error.issues.map((e) => e.message);
            invalidos.push({ ...linhaNormalizada, erros });
          }
        });

        resolve({ validos, invalidos, total: result.data.length });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}