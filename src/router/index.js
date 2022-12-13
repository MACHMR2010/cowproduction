import Vue from 'vue'
import VueRouter from 'vue-router'
import CowRecording from '../views/CowRecording.vue'
import MedicalExamination from '../views/MedicalExamination.vue'
import BirthRegistration from '../views/BirthRegistration.vue'
import MilkProduction from '../views/MilkProduction.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/medicalexamination',
    name: 'medicalexamination',
    component: MedicalExamination
  },
  {
    path: '/birthregistration',
    name: 'birthregistration',
    component:  BirthRegistration
  },
  {
    path: '/milkproduction',
    name: 'milkproduction',
    component:  MilkProduction
  },
  {
    path: '/cowrecording',
    name: 'cowrecording',
    component: CowRecording
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
