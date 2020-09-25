import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  const requiredRotues = ['/api', '/api/signup', '/api/signin', '/api/account']

  app.all('*', (req, res) => {
    for (const route of requiredRotues) {
      if (!req.url[route]) return res.json({ mensagem: 'mensagem de error' })
    }
  })

  router.get('/', (req, res) => {
    res.json({ messagem: 'Bem-vindo' })
  })

  const dir = join(__dirname, './')

  readdirSync(dir)
    .filter((files): boolean => files.endsWith('routes.ts', files.length))
    .map(
      async (file): Promise<any> =>
        (await import(`${dir}/${file}`)).default(router)
    )
}
