import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  const dir = join(__dirname, '../routes')

  readdirSync(dir)
    .filter((files): boolean => files.endsWith('routes.ts', files.length))
    .map(
      async (file): Promise<any> =>
        (await import(`${dir}/${file}`)).default(router)
    )
}
