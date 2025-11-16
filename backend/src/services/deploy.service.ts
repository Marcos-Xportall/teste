import axios from 'axios'
import { prisma } from '../config/database'
import { io } from '../index'

const VERCEL_API = 'https://api.vercel.com'
const VERCEL_TOKEN = process.env.VERCEL_TOKEN

interface Project {
  id: string
  name: string
  code: any
}

export async function deployToVercel(
  project: Project,
  deploymentId: string
): Promise<void> {
  try {
    if (!VERCEL_TOKEN) {
      throw new Error('VERCEL_TOKEN not configured')
    }

    // Prepare files for deployment
    const files = [
      {
        file: 'index.html',
        data: generateFullHTML(project.code),
      },
      {
        file: 'styles.css',
        data: project.code.css || '',
      },
      {
        file: 'script.js',
        data: project.code.javascript || '',
      },
    ]

    // Create deployment
    const response = await axios.post(
      `${VERCEL_API}/v13/deployments`,
      {
        name: `lasy-${project.id.substring(0, 8)}`,
        files: files.map((f) => ({
          file: f.file,
          data: Buffer.from(f.data).toString('base64'),
        })),
        projectSettings: {
          framework: null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const deploymentUrl = `https://${response.data.url}`

    // Update deployment record
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'SUCCESS',
        url: deploymentUrl,
        deploymentId: response.data.id,
      },
    })

    // Update project
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'DEPLOYED' },
    })

    // Emit success event
    io.to(`project:${project.id}`).emit('deployment-success', {
      projectId: project.id,
      url: deploymentUrl,
    })

    console.log(`✅ Deployed project ${project.id} to ${deploymentUrl}`)
  } catch (error: any) {
    console.error(`❌ Deployment failed for project ${project.id}:`, error)

    // Update deployment record
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'FAILED',
        error: error.message,
      },
    })

    // Emit error event
    io.to(`project:${project.id}`).emit('deployment-failed', {
      projectId: project.id,
      error: error.message,
    })
  }
}

function generateFullHTML(code: any): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lasy AI App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${code.html || ''}
  <script src="script.js"></script>
</body>
</html>`
}
