import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard', roles: ['admin', 'doctor', 'patient'] }
    }]
  }]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/manager',
    component: Layout,
    redirect: '/manager/user',
    name: '管理员菜单',
    meta: {
      title: '管理员菜单',
      icon: 'setting',
      roles: ['admin']
    },
    children: [
      {
        path: '/user',
        component: () => import('@/views/manager/user/index'), // Parent router-view
        name: '用户管理',
        meta: { title: '用户管理' }
      }
      // {
      //   path: '/hospital',
      //   component: () => import('@/views/manager/hospital/index'),
      //   name: '医院管理',
      //   meta: { title: '医院管理' }
      // },
      // {
      //   path: '/department',
      //   component: () => import('@/views/manager/department/index'),
      //   name: '科室管理',
      //   meta: { title: '科室管理' }
      // },
      // {
      //   path: '/doctor',
      //   component: () => import('@/views/manager/doctor/index'),
      //   name: '医生管理',
      //   meta: { title: '医生管理' }
      // },
      // {
      //   path: '/arrange_work',
      //   component: () => import('@/views/manager/arrange_work/index'),
      //   name: '医生排班管理',
      //   meta: { title: '医生排班管理' }
      // },
      // {
      //   path: '/register',
      //   component: () => import('@/views/manager/register/index'),
      //   name: '挂号管理',
      //   meta: { title: '挂号管理' }
      // },
      // {
      //   path: '/evaluation',
      //   component: () => import('@/views/manager/evaluation/index'),
      //   name: '评价管理',
      //   meta: { title: '评价管理' }
      // }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
