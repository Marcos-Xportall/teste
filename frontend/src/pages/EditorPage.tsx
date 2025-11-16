import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import Button from '../components/Button'
import { projectsAPI, aiAPI } from '../services/api'
import { Sparkles, Play, Download, Rocket, Code } from 'lucide-react'
import Editor from '@monaco-editor/react'

const EditorPage = () => {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  const [showPreview, setShowPreview] = useState(true)
  const [editPrompt, setEditPrompt] = useState('')
  const [code, setCode] = useState({
    html: '',
    css: '',
    javascript: '',
  })

  const { data: project, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await projectsAPI.getById(projectId!)
      return response.data
    },
    enabled: !!projectId,
  })

  useEffect(() => {
    if (project?.code) {
      setCode({
        html: project.code.html || '',
        css: project.code.css || '',
        javascript: project.code.javascript || '',
      })
    }
  }, [project])

  const generateMutation = useMutation({
    mutationFn: (prompt: string) =>
      projectsAPI.generate(projectId!, prompt),
    onSuccess: () => {
      toast.success('Código gerado com sucesso!')
      refetch()
      setEditPrompt('')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao gerar código')
    },
  })

  const deployMutation = useMutation({
    mutationFn: () => projectsAPI.deploy(projectId!),
    onSuccess: () => {
      toast.success('Projeto implantado com sucesso!')
      refetch()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao implantar')
    },
  })

  const handleGenerate = () => {
    if (!editPrompt.trim()) {
      toast.error('Digite uma instrução')
      return
    }
    generateMutation.mutate(editPrompt)
  }

  const getPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.javascript}</script>
        </body>
      </html>
    `
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="pt-16 h-screen flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">
                {project?.name}
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'html'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'css'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'js'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  JavaScript
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Play className="w-4 h-4 mr-2" />
                {showPreview ? 'Esconder' : 'Preview'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={deployMutation.mutate}
                isLoading={deployMutation.isPending}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>
        </div>

        {/* Editor & Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className={showPreview ? 'w-1/2' : 'w-full'}>
            <Editor
              height="100%"
              language={
                activeTab === 'html'
                  ? 'html'
                  : activeTab === 'css'
                  ? 'css'
                  : 'javascript'
              }
              value={code[activeTab === 'js' ? 'javascript' : activeTab]}
              onChange={(value) =>
                setCode({
                  ...code,
                  [activeTab === 'js' ? 'javascript' : activeTab]:
                    value || '',
                })
              }
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 bg-white border-l border-gray-800">
              <iframe
                srcDoc={getPreviewContent()}
                className="w-full h-full"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>

        {/* AI Prompt Bar */}
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Peça para a IA fazer alterações... (ex: 'mude a cor de fundo para azul')"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button
              onClick={handleGenerate}
              isLoading={generateMutation.isPending}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditorPage
