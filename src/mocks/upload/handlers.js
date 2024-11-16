import { http, HttpResponse } from 'msw'

export default [
  http.post('/api/upload', () => {
    return HttpResponse.json({
      uuid: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      name: '厚鬆餅堡廣告.mp4'
    })
  })
]
