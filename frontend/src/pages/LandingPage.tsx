import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { Sparkles, Zap, Code, Rocket, Check } from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Crie seu App Do Seu Jeito',
      description:
        'Conte sua ideia por áudio ou texto. A IA gera todo o app completo em minutos.',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Ajuste Simples',
      description:
        'Selecione qualquer parte e peça mudanças. A IA ajusta tudo instantaneamente.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Envie Referências',
      description:
        'Suba screenshots, URLs ou PDFs. A IA entende e cria a versão funcional.',
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Publicação em 1 Clique',
      description:
        'Deploy automático com SSL e domínio personalizado. Tudo pronto para vender.',
    },
  ]

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 47',
      credits: '500 créditos/mês',
      features: [
        '5 projetos',
        'Deploy ilimitado',
        'SSL automático',
        'Suporte por email',
      ],
    },
    {
      name: 'Pro',
      price: 'R$ 97',
      credits: '2000 créditos/mês',
      features: [
        '20 projetos',
        'Deploy ilimitado',
        'SSL automático',
        'Domínio personalizado',
        'Suporte prioritário',
        'Exportar código',
      ],
      popular: true,
    },
    {
      name: 'Scale',
      price: 'R$ 297',
      credits: '10000 créditos/mês',
      features: [
        'Projetos ilimitados',
        'Deploy ilimitado',
        'SSL automático',
        'Domínio personalizado',
        'Suporte dedicado',
        'Exportar código',
        'Integração GitHub',
        'Whitelabel',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
            Crie Apps com IA
            <br />
            Em Minutos
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto animate-slide-up">
            Transforme suas ideias em aplicativos completos usando apenas
            linguagem natural. Sem código, sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Começar Grátis
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Ver Demonstração
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-xl hover:glow transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Planos e Preços
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Escolha o plano ideal para suas necessidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass p-8 rounded-xl ${
                  plan.popular ? 'ring-2 ring-blue-600 glow' : ''
                } hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-blue-400 mb-6">{plan.credits}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para criar seu app?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de criadores que já estão usando IA para
            transformar suas ideias em realidade.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Começar Grátis Agora
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
