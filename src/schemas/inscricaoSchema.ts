import { z } from 'zod';

export const origensValidas = ['evento', 'redes_sociais', 'site'] as const;
export const statusValidos = ['pendente', 'aprovado'] as const;

export const inscricaoSchema = z.object({
  id: z.string(),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  origem: z.enum(origensValidas),
  status: z.enum(statusValidos),
  criadoEm: z.string().datetime({ offset: true }),
});

export const inscricoesListSchema = z.array(inscricaoSchema);
export type Inscricao = z.infer<typeof inscricaoSchema>;

export const cadastroFormSchema = inscricaoSchema
  .pick({ nome: true, email: true, origem: true })
  .extend({
    origem: z.enum(origensValidas, { message: "Selecione uma origem válida" }),
  });

export type CadastroFormData = z.infer<typeof cadastroFormSchema>;