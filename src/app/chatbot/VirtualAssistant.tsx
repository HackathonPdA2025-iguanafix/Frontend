'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import LogoIguanafix from '@/components/LogoIguadafix';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
 // ...existing code...
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Olá! Sou a Iguana, sua assistente virtual. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
    },
  ]);
// ...existing code...
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    // TODO: Implementar upload real
    console.log('Arquivo selecionado:', file.name);
    
    // Por enquanto, apenas simular
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: `📎 Arquivo enviado: ${file.name}`,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: '✅ Arquivo recebido! Quando terminar de enviar todos os documentos, digite "Documentos enviados".',
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !token) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setLoading(true);

    try {
      // Chamar API do chatbot
      const response = await axios.post(
        `${API_URL}/chatbot/chat`,
        {
          message: userMessage,
          section: 'dashboard',
          sectionTitle: 'Assistente Virtual',
          context: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.message || response.data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Desculpe, ocorreu um erro. Tente novamente mais tarde.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInput(question);
    // Simular envio automático
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleQuickAction = async (action: string) => {
    // Enviar ação diretamente
    if (loading || !token) return;
    
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: action,
        timestamp: new Date(),
      },
    ]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/chatbot/chat`,
        {
          message: action,
          section: 'dashboard',
          sectionTitle: 'Assistente Virtual',
          context: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.message || response.data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Desculpe, ocorreu um erro. Tente novamente mais tarde.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Detectar se deve mostrar botões de ação
  const getQuickActions = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'assistant') return [];

    const content = lastMessage.content.toLowerCase();
    
    // Se pede confirmação
    if (content.includes('confirmar')) {
      return [
        { label: '✅ Confirmar', action: 'confirmar' },
        { label: '🔙 Voltar', action: 'etapa anterior' },
      ];
    }

    // Se mostra opções de etapas
    if (content.includes('etapa 1') && content.includes('ajustar')) {
      return [
        { label: '✅ Confirmar', action: 'confirmar' },
        { label: '📝 Ajustar Etapa 1', action: 'etapa 1' },
      ];
    }

    if (content.includes('etapa 2') && content.includes('ajustar')) {
      return [
        { label: '✅ Confirmar', action: 'confirmar' },
        { label: '📝 Ajustar Etapa 2', action: 'etapa 2' },
      ];
    }

    if (content.includes('etapa 3') && content.includes('ajustar')) {
      return [
        { label: '✅ Confirmar', action: 'confirmar' },
        { label: '📝 Ajustar Etapa 3', action: 'etapa 3' },
      ];
    }

    if (content.includes('etapa 4') && content.includes('ajustar')) {
      return [
        { label: '✅ Confirmar', action: 'confirmar' },
        { label: '📝 Ajustar Etapa 4', action: 'etapa 4' },
      ];
    }

    return [];
  };

  const quickQuestions = [
    '🚀 Quero começar meu cadastro',
    '🤔 Como funciona o cadastro?',
    '📄 Quais documentos preciso?',
    '⏱️ Qual o prazo de aprovação?',
    '💰 Como recebo pelos serviços?',
  ];

  return (
  <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      
      {/* Janela do Chat */}
      {isOpen && (
        // Container da janela: ocupa a tela inteira no mobile, janela flutuante no desktop
        <div className="
          fixed inset-0 md:inset-auto md:bottom-0 md:right-0
          w-full h-full md:w-96 md:h-[70vh] md:max-h-[600px]
          bg-white rounded-none md:rounded-lg shadow-2xl 
          flex flex-col border border-gray-200
        ">
          {/* Logo - Visível apenas no estado inicial (opcional, mas bom para mobile) */}
          {messages.length === 1 && (
            <div className="pt-10 pb-4 hidden md:flex justify-center items-center">
              <LogoIguanafix />
            </div>
          )}

          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shrink-0 md:rounded-t-lg">
            <div>
              <h3 className="font-bold text-lg">Iguana</h3>
              <p className="text-xs opacity-90">Assistente Virtual</p>
            </div>
            {/* O botão de fechar principal é movido para o botão flutuante no mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition hidden md:block"
            >
              ✕
            </button>
          </div>

          {/* Corpo das Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Perguntas Rápidas no Início */}
            {messages.length === 1 && (
              <div className="space-y-2">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-sm text-gray-700 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Lista de Mensagens */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 text-right ${msg.role === 'user' ? 'opacity-70' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicador de "Digitando..." */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de Input */}
          <div className="border-t border-gray-200 p-3 bg-white shrink-0 md:rounded-b-lg">
            <div className="flex items-center gap-2">
              <input id="fileUpload" type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => document.getElementById('fileUpload')?.click()}
                disabled={loading}
                className="p-2 h-10 w-10 flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-xl transition"
                title="Enviar arquivo"
              >
                📎
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 h-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="p-2 h-10 w-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-xl transition"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante para Abrir/Fechar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
