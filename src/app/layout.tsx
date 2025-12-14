import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Provider Onboarding - Cadastro de Prestadores',
  description: 'Plataforma de onboarding para prestadores de serviço com chatbot inteligente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
