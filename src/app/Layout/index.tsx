import React, { useState } from "react"
import LogoIguanafix from '@/components/LogoIguadafix'
import { Menu, X, LogOut, Home, Settings, Bell } from 'lucide-react'

type DashboardLayoutProps = {
  children: React.ReactNode
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  onLogout: () => void
}

export default function DashboardLayout({
  children,
  user,
  onLogout,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const navItems = [
    { label: "Dashboard", icon: Home, href: "#" },
    { label: "Configurações", icon: Settings, href: "#" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo e Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
      
            <LogoIguanafix />   
            
          </div>

          {/* Título Central */}
          <div className="hidden sm:block flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notificações"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Dropdown de Notificações */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Notificações</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-500">Nenhuma notificação no momento</p>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do Usuário */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "P"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "Prestador"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>

            {/* Botão Sair */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTAINER PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative w-64 h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
        >
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 font-medium"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* CONTEÚDO DINÂMICO */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* OVERLAY PARA MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 text-center text-sm text-gray-600 py-4 px-4">
        <p>© {new Date().getFullYear()} IguanaFix. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
