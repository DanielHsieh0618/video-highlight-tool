import { createRouter, createWebHistory } from 'vue-router'
import UploadView from '../views/UploadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'upload',
      component: UploadView
    },
    {
      path: '/videos/:uuid/editor',
      name: 'video-editor',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EditorView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: UploadView }
  ]
})

export default router
