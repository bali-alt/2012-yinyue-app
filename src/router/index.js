import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Lazyload
} from 'vant';


Vue.use(VueRouter);
Vue.use(Lazyload, {
  lazyComponent: true
});

const routes = [{
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/Reg',
    name: 'Reg',
    component: () => import('../views/Reg.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      isLogin: true
    },
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
        next()
      } else {
        next({
          path: '/Login'
        })
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router