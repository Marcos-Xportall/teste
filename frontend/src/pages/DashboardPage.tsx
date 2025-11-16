import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import Button from '../components/Button'
import { projectsAPI } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { Plus, Sparkles, Rocket, Code } from 'lucide-react'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    prompt: '',
  })

  const { data: projects, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll()
      return response.data
    },
  })

  const createProjectMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: (response) => {
      toast.success('Projeto criado com sucesso!')
      setIsCreating(false)
      setNewProjectData({ name: '', description: '', prompt: '' })
      refetch()
      navigate(`/editor/${response.data.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar projeto')
    },
  })

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    createProjectMutation.mutate(newProjectData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Bem-vindo de volta, {user?.name}!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Créditos</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {user?.credits || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Projetos</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {projects?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Plano</p>
                  <p className="text-3xl font-bold text-white mt-1 capitalize">
                    {user?.plan || 'Starter'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Create New Project */}
          {!isCreating ? (
            <Button
              onClick={() => setIsCreating(true)}
              size="lg"
              className="mb-8"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Projeto
            </Button>
          ) : (
            <div className="glass p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Criar Novo Projeto
              </h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectData.name}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Meu App Incrível"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectData.description}
                    onChange={(e) =>
                      setNewProjectData({
                        ...newProjectData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Uma breve descrição do seu app"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descreva seu app (O que você quer criar?)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newProjectData.prompt}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, prompt: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Exemplo: Quero criar um dashboard de vendas com gráficos em tempo real, tabela de produtos e sistema de filtros..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    isLoading={createProjectMutation.isPending}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar com IA
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false)
                      setNewProjectData({ name: '', description: '', prompt: '' })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Projects List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Seus Projetos
            </h2>
            {!projects || projects.length === 0 ? (
              <div className="glass p-12 rounded-xl text-center">
                <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Você ainda não tem projetos. Crie seu primeiro app!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <Link
                    key={project.id}
                    to={`/editor/${project.id}`}
                    className="glass p-6 rounded-xl hover:glow transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          project.status === 'deployed'
                            ? 'bg-green-600/20 text-green-400'
                            : project.status === 'ready'
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
