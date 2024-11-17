import { http, HttpResponse, delay } from 'msw'

export default [
  http.post('/api/videos/:uuid/analyze', async () => {
    await delay(4000)
    return await HttpResponse.json({
      uuid: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      name: '厚鬆餅堡廣告.mp4',
      url: '/video-highlight-tool/videoplay-360p.mp4',
      duration: 25,
      transcript:
        '早晨就該這麼鬆。微甜新滋味。蓬鬆厚實，有甜有鹹。一早鬆一個，MacGriddles 厚鬆餅堡早晨限定。享受一早酥脆，升級薯餅套餐更有活力。',
      sections: [
        {
          title: 'Opening',
          clips: [
            {
              timestamp: '00:00',
              start: 0,
              end: 1,
              text: '',
              highlight: false,
              url: '/video-highlight-tool/part1.mp4',
              captionSrc: '/video-highlight-tool/part1.vtt'
            },
            {
              timestamp: '00:01',
              start: 1,
              end: 5,
              text: '早晨就該這麼鬆。',
              highlight: false,
              url: '/video-highlight-tool/part2.mp4',
              captionSrc: '/video-highlight-tool/part2.vtt'
            },
            {
              timestamp: '00:05',
              start: 5,
              end: 9,
              text: '微甜新滋味。',
              highlight: false,
              url: '/video-highlight-tool/part3.mp4',
              captionSrc: '/video-highlight-tool/part3.vtt'
            }
          ]
        },
        {
          title: 'McGriddles 厚鬆餅堡',
          clips: [
            {
              timestamp: '00:09',
              start: 9,
              end: 15,
              text: '蓬鬆厚實，有甜有鹹，一早鬆一個。',
              highlight: false,
              url: '/video-highlight-tool/part4.mp4',
              captionSrc: '/video-highlight-tool/part4.vtt'
            },
            {
              timestamp: '00:15',
              start: 15,
              end: 20,
              text: 'McGriddles 厚鬆餅堡，早晨限定。',
              highlight: true,
              url: '/video-highlight-tool/part5.mp4',
              captionSrc: '/video-highlight-tool/part5.vtt'
            }
          ]
        },
        {
          title: 'Closure',
          clips: [
            {
              timestamp: '00:20',
              start: 20,
              end: 25,
              text: '享受一早酥脆，升級薯餅套餐更有活力。',
              highlight: true,
              url: '/video-highlight-tool/part6.mp4',
              captionSrc: '/video-highlight-tool/part6.vtt'
            }
          ]
        }
      ]
    })
  })
]
