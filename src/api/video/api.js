import { instance } from '../request'

export function analyzeVideo(uuid, config = {}) {
  return instance.request({
    url: `/videos/${uuid}/analyze/`,
    method: 'post',
    ...config
  })
}
