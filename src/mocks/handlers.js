import { http, delay } from 'msw'
import videoHandlers from './video/handlers'
import uploadHandlers from './upload/handlers'

export const handlers = [
  http.all('*', async () => {
    await delay(1000)
  }),
  ...videoHandlers,
  ...uploadHandlers
]
