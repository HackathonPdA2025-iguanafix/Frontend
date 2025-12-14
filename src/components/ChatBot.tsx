'use client';

import { useState, useRef, useEffect } from 'react';
import { chatbotService } from '@/services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  onFieldUpdate?: (fieldName: string, value: string) => void;
  onComplete?: (data: Record<string, string>) => void;
}

export function ChatBot({ onFieldUpdate, onComplete }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Olá! 👋 Bem-vindo ao cadastro de prestadores de serviço. Vamos começar com algumas informações básicas. Qual é o seu nome completo?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { field: 'nome', question: 'Qual é o seu nome completo?' },
    { field: 'email', question: 'Qual é o seu melhor email para contato?' },
    { field: 'cpfCnpj', question: 'Qual é o seu CPF ou CNPJ? (apenas números)' },
    { field: 'areaAtuacao', question: 'Qual é sua área de atuação?' },
    { field: 'senha', question: 'Crie uma senha segura (mínimo 8 caracteres)' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const newData = { ...collectedData, [steps[currentStep].field]: input.trim() };
    setCollectedData(newData);

    if (onFieldUpdate) {
      onFieldUpdate(steps[currentStep].field, input.trim());
    }

    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.chat({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userMessage: input,
      });

      const assistantMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // All steps completed
        if (onComplete) {
          setTimeout(() => {
            onComplete(newData);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="card flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg pb-4 px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Assistente de Cadastro</h2>
            <p className="text-blue-100 text-sm">
              Etapa {currentStep + 1} de {steps.length}
            </p>
          </div>
        </div>
        <div className="w-full bg-blue-400 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {currentStep < steps.length && (
        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            placeholder="Digite sua resposta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="input-field flex-1"
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      )}
    </div>
  );
}
