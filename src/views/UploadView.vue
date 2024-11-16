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

const onUpload = () => {
  toast.add({
    severity: 'info',
    summary: 'Success',
    detail: 'File Uploaded',
    life: 3000
  })
  router.push({ name: 'editor' })
}
</script>

<template>
  <div
    class="pt-9 flex flex-col gap-6 items-center justify-center items-center"
  >
    <Toast />
    <FileUpload
      ref="fileUploadRef"
      mode="basic"
      name="video"
      url="/api/upload"
      accept="video/mp4,video/x-m4v,video/*"
      @upload="onUpload"
    />
    <Button label="Upload" @click="upload" severity="secondary" />
  </div>
</template>
