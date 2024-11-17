<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { analyzeVideo } from '@/api/video/api'
const route = useRoute()
const { uuid } = route.params
const video = ref(null)
const loading = ref(false)
const currentVideo = ref({
  url: null,
  captionSrc: null,
  playing: false
})

const fetchingAnalyzedVideo = async () => {
  loading.value = true
  const response = await analyzeVideo(uuid)
  video.value = response.data
  loading.value = false
}

onBeforeMount(() => {
  fetchingAnalyzedVideo()
})

async function onClickSentence(sentence) {
  currentVideo.value.url = sentence.url
  currentVideo.value.captionSrc = sentence.captionSrc
  const video = document.querySelector('video')
  await video.load()
  await video.play()
  currentVideo.value.playing = true
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
    class="w-full md:h-[100dvh] flex items-stretch gap-0 md:flex-nowrap flex-wrap md:!flex-row flex-col-reverse"
  >
    <div class="bg-[#efefef] p-4 basis-full md:basis-1/2">
      <h3 class="text-xl font-bold !mb-5">Transcript</h3>
      <div
        v-for="(section, sectionIdx) in video.sections || []"
        :key="`section_${sectionIdx}`"
        class="!mb-5"
      >
        <h5 class="text-lg font-bold !mb-2 indent-1">{{ section.title }}</h5>
        <div
          v-for="(sentence, sentenceIdx) in section.sentences || []"
          :key="`sentence_${sectionIdx}_${sentenceIdx}`"
          :class="{
            '!bg-blue-500': sentence.highlight,
            '!text-white': sentence.highlight
          }"
          class="bg-white p-2 flex gap-2 !mb-2 rounded"
        >
          <div
            class="font-bold cursor-pointer"
            :class="{
              'text-blue-500': !sentence.highlight,
              'text-white': sentence.highlight
            }"
            @click="onClickSentence(sentence)"
          >
            {{ sentence.timestamp }}
          </div>
          <p class="break-words">
            {{ sentence.text }}
          </p>
        </div>
      </div>
    </div>
    <div class="bg-gray-800 p-4 basis-full md:basis-1/2">
      <h3 class="text-xl font-bold !mb-3 text-white">Preview</h3>
      <div class="flex justify-center">
        <video
          :src="currentVideo.url"
          preload="auto"
          playsinline
          controls
          class="w-auto mx-auto"
        >
          <track
            default
            kind="captions"
            :src="currentVideo.captionSrc"
            srclang="zh-tw"
          />
        </video>
      </div>
    </div>
  </div>
</template>
