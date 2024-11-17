<script setup>
import Button from 'primevue/button'
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { analyzeVideo } from '@/api/video/api'
import { useMouseInElement, useEventListener } from '@vueuse/core'

const route = useRoute()
const { uuid } = route.params

const video = ref({
  uuid: '',
  name: '',
  url: '',
  transcript: '',
  duration: 0,
  sections: []
})

const currentClip = ref({
  timestamp: '',
  start: null,
  end: null,
  text: '',
  highlight: false,
  url: '',
  captionSrc: ''
})
const videoCurrentTime = ref(0)
const loading = ref(false)
const videoRef = ref(null)
const scrubberRef = ref(null)
const scrubbing = ref(false)
const playing = ref(false)

const clips = computed(() => {
  const clonedClips =
    video.value?.sections?.reduce((acc, section) => {
      const sectionClips = section.clips?.map((clip) => {
        return {
          ...clip,
          duration: clip.end - clip.start,
          percent: (clip.end - clip.start) / video.value.duration
        }
      })
      return acc.concat(sectionClips || [])
    }, []) || []
  return clonedClips
})

const highlightedClips = computed(() => {
  return clips.value.filter((clip) => clip.highlight)
})

onBeforeMount(async () => {
  await fetchingAnalyzedVideo()
  currentClip.value = JSON.parse(
    JSON.stringify(highlightedClips.value?.[0] || currentClip.value)
  )
})

async function fetchingAnalyzedVideo() {
  loading.value = true
  const response = await analyzeVideo(uuid)
  video.value = response.data
  loading.value = false
}

async function onClickTimestamp(clip) {
  const clonedClip = JSON.parse(JSON.stringify(clip))
  currentClip.value.url = clonedClip.url
  currentClip.value.timestamp = clonedClip.timestamp
  currentClip.value.start = clonedClip.start
  currentClip.value.end = clonedClip.end
  currentClip.value.text = clonedClip.text
  currentClip.value.captionSrc = clonedClip.captionSrc
  await videoRef.value.load()
}

function onClickClip(clip) {
  toggleHighlight(clip)
}

function toggleHighlight(clip) {
  clip.highlight = !clip.highlight

  // Reset current clip if the highlighted clip is the same as the current clip
  if (!clip.highlight && clip.start === currentClip.value.start) {
    currentClip.value.url = ''
    currentClip.value.timestamp = ''
    currentClip.value.start = null
    currentClip.value.end = null
    currentClip.value.text = ''
    currentClip.value.captionSrc = ''
  }
}

async function onClickPlay() {
  if (currentClip.value.start === null) {
    const firstClip = highlightedClips.value?.[0]
    if (firstClip) {
      await onClickTimestamp(firstClip)
    }
  }

  if (playing.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  playing.value = !playing.value
}

async function onVideoEnded() {
  const currentClipIdx = highlightedClips.value.findIndex(
    (clip) => clip.start === currentClip.value.start
  )
  const nextClipIdx = currentClipIdx + 1
  if (nextClipIdx < highlightedClips.value.length) {
    const nextClip = highlightedClips.value[nextClipIdx]
    await onClickTimestamp(nextClip)
    videoRef.value.play()
  } else {
    await onClickTimestamp(highlightedClips.value?.[0] || currentClip.value)
    playing.value = false
  }
}

function onVideoTimeUpdate() {
  videoCurrentTime.value = videoRef.value.currentTime
}

const { elementX, elementWidth } = useMouseInElement(scrubberRef)
useEventListener('mouseup', () => (scrubbing.value = false))

watch([scrubbing, elementX], async () => {
  const progress = Math.max(0, Math.min(1, elementX.value / elementWidth.value))

  if (scrubbing.value) {
    const newStartTime = progress * video.value.duration
    const nextClipIdx = highlightedClips.value.findIndex(
      (clip) => clip.start > newStartTime
    )
    const currentClipIdx = nextClipIdx - 1
    const curClip =
      highlightedClips.value[currentClipIdx] ||
      highlightedClips.value[highlightedClips.value.length - 1]
    if (newStartTime - curClip.start < 0) {
      return
    }

    videoCurrentTime.value = newStartTime - curClip.start
    await onClickTimestamp(curClip)
    videoRef.value.currentTime = videoCurrentTime.value
    videoRef.value.pause()
    playing.value = false
  }
})

async function onClickBackward() {
  if (videoCurrentTime.value > 0) {
    videoCurrentTime.value = 0
    videoRef.value.currentTime = 0
  } else {
    const currentClipIdx = highlightedClips.value.findIndex(
      (clip) => clip.start === currentClip.value.start
    )
    const prevClipIdx = currentClipIdx - 1
    if (prevClipIdx >= 0) {
      const prevClip = highlightedClips.value[prevClipIdx]
      await onClickTimestamp(prevClip)
    } else {
      await onClickTimestamp(highlightedClips.value?.[0] || currentClip.value)
    }
  }
  videoRef.value.pause()
  playing.value = false
}

async function onClickForward() {
  const currentClipIdx = highlightedClips.value.findIndex(
    (clip) => clip.start === currentClip.value.start
  )
  const nextClipIdx = currentClipIdx + 1
  if (nextClipIdx < highlightedClips.value.length) {
    const nextClip = highlightedClips.value[nextClipIdx]
    await onClickTimestamp(nextClip)
  } else {
    await onClickTimestamp(
      highlightedClips.value?.[highlightedClips.value.length - 1] ||
        currentClip.value
    )
  }
  videoRef.value.pause()
  playing.value = false
}
</script>

<template>
  <div
    v-if="loading"
    class="pt-9 flex flex-col gap-6 items-center justify-center items-center"
  >
    <h1 class="text-2xl font-bold">Edit Video</h1>
    <div>Processing...</div>
  </div>
  <div
    v-else
    class="w-full md:h-[100dvh] flex items-stretch gap-0 md:flex-nowrap flex-wrap"
  >
    <div class="bg-[#efefef] p-4 basis-full md:basis-1/2 order-2 md:order-1">
      <h3 class="text-xl font-bold !mb-5">Transcript</h3>
      <div
        v-for="(section, sectionIdx) in video.sections || []"
        :key="`section_${sectionIdx}`"
        class="!mb-5"
      >
        <h5 class="text-lg font-bold !mb-2 indent-1">{{ section.title }}</h5>
        <div
          v-for="(clip, clipIdx) in section.clips || []"
          :key="`sentence_${sectionIdx}_${clipIdx}`"
          :class="{
            '!bg-blue-500': clip.highlight,
            '!text-white': clip.highlight,
            'border-2 border-red-500': currentClip.start === clip.start
          }"
          class="bg-white p-2 flex gap-2 !mb-2 rounded cursor-pointer"
          @click="onClickClip(clip)"
        >
          <div
            class="font-bold timestamp"
            :class="{
              'text-white': clip.highlight,
              'cursor-pointer': clip.highlight,
              'text-blue-500': !clip.highlight,
              'cursor-not-allowed': !clip.highlight
            }"
            @click.stop.prevent="clip.highlight ? onClickTimestamp(clip) : null"
          >
            {{ clip.timestamp }}
          </div>
          <p class="break-words">
            {{ clip.text }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="bg-gray-800 p-4 basis-full md:basis-1/2 pb-6 order-1 md:order-2"
    >
      <h3 class="text-xl font-bold !mb-3 text-white">Preview</h3>
      <div class="flex relative justify-center w-full aspect-video">
        <video
          ref="videoRef"
          :src="currentClip.url"
          playsinline
          class="block"
          :key="currentClip.url"
          @timeupdate="onVideoTimeUpdate"
          @ended="onVideoEnded"
        >
          <track
            default
            kind="captions"
            :key="currentClip.captionSrc"
            :src="currentClip.captionSrc"
            srclang="zh-tw"
          />
        </video>
      </div>
      <div class="w-full !mt-2 relative">
        <div
          class="flex justify-between items-center p-2 !pb-4 [&>.p-button]:text-white [&>.p-button:hover]:!text-black"
        >
          <Button
            icon="pi pi-step-backward"
            severity="secondary"
            variant="text"
            rounded
            aria-label="Backward"
            @click="onClickBackward"
          />
          <Button
            :icon="playing ? 'pi pi-pause' : 'pi pi-play'"
            severity="secondary"
            variant="text"
            rounded
            :aria-label="playing ? 'Pause' : 'Play'"
            @click="onClickPlay"
          />
          <Button
            icon="pi pi-step-forward"
            severity="secondary"
            variant="text"
            rounded
            aria-label="Forward"
            @click="onClickForward"
          />
          <span class="text-white">
            {{
              Math.floor((currentClip.start + videoCurrentTime) / 60)
                .toString()
                .padStart(2, '0')
            }}
            :
            {{
              Math.floor((currentClip.start + videoCurrentTime) % 60)
                .toString()
                .padStart(2, '0')
            }}
          </span>
        </div>
        <div
          ref="scrubberRef"
          class="h-6 bg-gray-700 rounded flex relative"
          @mousedown="scrubbing = true"
        >
          <div
            v-for="clip in clips"
            :key="`clip-${clip.start}`"
            :class="{
              '!bg-blue-500': clip.highlight,
              'cursor-pointer': clip.highlight
            }"
            class="rounded-sm"
            :style="{ width: `${clip.percent * 100}%` }"
          ></div>
          <div
            class="w-1 h-full bg-red-500 rounded-sm absolute"
            :style="{
              left:
                ((currentClip.start + videoCurrentTime) / video.duration) *
                  100 +
                '%'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
