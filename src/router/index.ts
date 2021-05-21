import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/count',
    name: 'Count',
    component: () => import(/* webpackChunkName: "count" */ '../views/Count.vue')
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: () => import(/* webpackChunkName: "UserInfo" */ '../views/userPage/UserInfo.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
