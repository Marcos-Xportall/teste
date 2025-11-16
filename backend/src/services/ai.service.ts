import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '../config/database'
import { io } from '../index'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateAppIdea(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' })

  const systemPrompt = `
Você é um assistente de IA especializado em gerar ideias de aplicativos web.
Dado um prompt do usuário, crie uma descrição detalhada de um aplicativo incluindo:
- Funcionalidades principais
- Design sugerido
- Tecnologias recomendadas
- Diferenciais

Seja criativo e prático.
`

  const result = await model.generateContent([systemPrompt, prompt])
  const response = result.response
  return response.text()
}

export async function generateCode(
  prompt: string,
  context?: any
): Promise<{ html: string; css: string; javascript: string }> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' })

  const systemPrompt = `
Você é um gerador de código especializado em criar aplicativos web completos.

IMPORTANTE: Retorne APENAS um JSON válido no seguinte formato:
{
  "html": "código HTML completo",
  "css": "código CSS completo",
  "javascript": "código JavaScript completo"
}

Regras:
1. HTML: Estrutura semântica, acessível, com todos os elementos necessários
2. CSS: Estilização moderna, responsiva, usando Flexbox/Grid
3. JavaScript: Código funcional, limpo, sem dependências externas quando possível
4. O código deve ser completo e funcional
5. Use boas práticas e código limpo
6. SEMPRE retorne JSON válido, sem texto antes ou depois
7. Escape aspas duplas dentro das strings JSON usando \\"

${context ? `Contexto do projeto existente:\n${JSON.stringify(context)}` : ''}
`

  const result = await model.generateContent([systemPrompt, `Crie o código para: ${prompt}`])
  const response = result.response.text()

  try {
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const code = JSON.parse(jsonMatch[0])

    return {
      html: code.html || '',
      css: code.css || '',
      javascript: code.javascript || code.js || '',
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    console.error('Response:', response)

    // Fallback: return a basic structure
    return {
      html: '<div class="container"><h1>Erro ao gerar código</h1><p>Por favor, tente novamente.</p></div>',
      css: '.container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }',
      javascript: 'console.log("Code generation failed");',
    }
  }
}

export async function generateProjectCode(
  projectId: string,
  prompt: string,
  userId: string,
  existingCode?: any
): Promise<void> {
  try {
    // Generate code
    const code = await generateCode(prompt, existingCode)

    // Update project
    await prisma.project.update({
      where: { id: projectId },
      data: {
        code,
        status: 'READY',
      },
    })

    // Emit event via WebSocket
    io.to(`project:${projectId}`).emit('code-generated', { projectId, code })

    console.log(`✅ Code generated for project ${projectId}`)
  } catch (error) {
    console.error(`❌ Error generating code for project ${projectId}:`, error)

    // Update project status to failed
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'FAILED' },
    })

    // Emit error event
    io.to(`project:${projectId}`).emit('code-generation-failed', {
      projectId,
      error: 'Failed to generate code',
    })
  }
}

export async function editComponent(
  componentCode: string,
  instruction: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' })

  const systemPrompt = `
Você é um assistente de IA especializado em editar código.

Dado um código de componente e uma instrução, modifique o código conforme solicitado.

Retorne APENAS o código modificado, sem explicações adicionais.
`

  const result = await model.generateContent([
    systemPrompt,
    `Código atual:\n${componentCode}\n\nInstrução: ${instruction}`,
  ])

  const response = result.response
  return response.text()
}

export async function analyzeImage(imageUrl: string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const systemPrompt = `
Analise esta imagem de design/screenshot e extraia:
1. Estrutura de layout
2. Cores principais
3. Componentes identificados
4. Tipografia sugerida
5. Código HTML/CSS sugerido

Retorne um JSON com essas informações.
`

  const imagePart = {
    inlineData: {
      data: imageUrl,
      mimeType: 'image/jpeg',
    },
  }

  const result = await model.generateContent([systemPrompt, imagePart])
  const response = result.response

  try {
    return JSON.parse(response.text())
  } catch {
    return { analysis: response.text() }
  }
}
