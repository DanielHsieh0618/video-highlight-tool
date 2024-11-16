<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

import { useToast } from 'primevue/usetoast'
const toast = useToast()
const fileUploadRef = ref()
const router = useRouter()
const upload = () => {
  fileUploadRef.value.upload()
}

const loading = ref(false)
const onBeforeUpload = () => {
  loading.value = true
}

const onUpload = ({ xhr }) => {
  const { uuid } = JSON.parse(xhr.response)
  loading.value = false
  router.push({ name: 'video-editor', params: { uuid } })
  toast.add({
    severity: 'info',
    summary: 'Success',
    detail: 'File Uploaded',
    life: 3000
  })
}
</script>

<template>
  <div
    class="pt-9 flex flex-col gap-6 items-center justify-center items-center"
  >
    <h1 class="text-2xl font-bold">Upload Video</h1>
    <FileUpload
      ref="fileUploadRef"
      mode="basic"
      name="video"
      url="/api/upload"
      accept="video/mp4,video/x-m4v,video/*"
      :disabled="loading"
      @before-upload="onBeforeUpload"
      @upload="onUpload"
    ></FileUpload>
    <Button
      label="Upload"
      severity="secondary"
      :loading="loading"
      @click="upload"
    />
  </div>
</template>
