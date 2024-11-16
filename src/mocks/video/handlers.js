import { http, HttpResponse, delay } from 'msw'

export default [
  http.post('/api/videos/:uuid/analyze', async () => {
    await delay(4000)
    return await HttpResponse.json({
      uuid: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      name: '厚鬆餅堡廣告.mp4',
      url: '/video-highlight-tool/videoplay-360p.mp4',
      transcript:
        '早晨就該這麼鬆。微甜新滋味。蓬鬆厚實，有甜有鹹。一早鬆一個，MacGriddles 厚鬆餅堡早晨限定。享受一早酥脆，升級薯餅套餐更有活力。',
      sections: [
        {
          title: 'Intro',
          sentences: [
            {
              start: 1,
              end: 6,
              timestamp: '00:01',
              text: '早晨就該這麼鬆。',
              highlight: false
            },
            {
              start: 6,
              end: 20,
              timestamp: '00:06',
              text: '微甜新滋味。',
              highlight: false
            }
          ]
        },
        {
          title: 'MacGriddles 厚鬆餅堡',
          sentences: [
            {
              start: 9,
              end: 20,
              timestamp: '00:09',
              text: '蓬鬆厚實，有甜有鹹。一早鬆一個，MacGriddles 厚鬆餅堡早晨限定。',
              highlight: true
            }
          ]
        },
        {
          title: 'Outro',
          sentences: [
            {
              start: 20,
              end: 25,
              timestamp: '00:20',
              text: '享受一早酥脆，升級薯餅套餐更有活力。',
              highlight: true
            }
          ]
        }
      ]
    })
  })
]

// const transcriptions = {
//   '0:01': '早晨就該這麼鬆。',
//   '0:06': '微甜新滋味。',
//   '0:09': '蓬鬆厚實，有甜有鹹。一早鬆一個，MacGriddles 厚鬆餅堡早晨限定。',
//   '0:20': '享受一早酥脆，升級薯餅套餐更有活力。'
// }
