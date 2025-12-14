import { z } from 'zod';

export const ProviderRegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpfCnpj: z.string().regex(/^\d{11,14}$/, 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos'),
  areaAtuacao: z.string().min(3, 'Área de atuação é obrigatória'),
});

export const ProviderLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const ChatbotRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  userMessage: z.string().min(1, 'Mensagem não pode estar vazia'),
});

export type ProviderRegisterInput = z.infer<typeof ProviderRegisterSchema>;
export type ProviderLoginInput = z.infer<typeof ProviderLoginSchema>;
export type ChatbotRequestInput = z.infer<typeof ChatbotRequestSchema>;
