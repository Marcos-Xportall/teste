import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import Button from '../components/Button'
import { useAuthStore } from '../stores/authStore'
import { userAPI } from '../services/api'
import { User, CreditCard, Bell, Shield } from 'lucide-react'

const SettingsPage = () => {
  const { user, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications'>('profile')
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (response) => {
      setUser(response.data)
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil')
    },
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logout realizado com sucesso!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Configurações
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="col-span-1">
              <div className="glass rounded-xl p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'billing'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Billing</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="col-span-3">
              <div className="glass rounded-xl p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Informações do Perfil
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          isLoading={updateProfileMutation.isPending}
                        >
                          Salvar Alterações
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={handleLogout}
                        >
                          Sair
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Plano e Pagamento
                    </h2>
                    <div className="space-y-6">
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-400 text-sm">Plano Atual</p>
                            <p className="text-2xl font-bold text-white capitalize mt-1">
                              {user?.plan || 'Starter'}
                            </p>
                          </div>
                          <Button variant="primary">
                            Fazer Upgrade
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6">
                        <p className="text-gray-400 text-sm mb-2">Créditos Restantes</p>
                        <p className="text-3xl font-bold text-blue-400">
                          {user?.credits || 0}
                        </p>
                        <Button variant="outline" className="mt-4">
                          Comprar Mais Créditos
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Preferências de Notificação
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">
                            Receba atualizações por email
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Deploy Alerts</p>
                          <p className="text-gray-400 text-sm">
                            Notificações sobre deploys
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
