import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import Home from '@/components/Home'
import Signin from '@/components/SignIn'
import Students from '@/components/students'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // meta: { requiresAuth: true },
      children: [
        Students
      ]
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: Signin
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) {
      next({
        path: 'signin',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
