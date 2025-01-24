import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

//  系统管理
const System = {
  path: '/adminSys',
  name: 'adminSys',
  component: Main,
  meta: {
    title: '系统管理'
  },
  children: [
    // 基础配置
    {
      path: 'baseManager',
      name: 'baseManager',
      component: parentView,
      meta: {
        title: '基础配置'
      },
      children: [
        {
          path: 'userManager',
          name: 'userManager',
          meta: {
            title: '用户管理'
          },
          component: () => import('@/view/admin/user/UserList.vue')
        },
        {
          path: 'persionalSettings',
          name: 'persionalSettings',
          meta: {
            title: '个人设置',
            notCache: true
          },
          props: true,
          component: () =>
            import('@/view/admin/user/persional-settings/PersionalSettings.vue')
        },
        {
          path: 'editPasswordForm',
          name: 'editPasswordForm',
          meta: {
            title: '修改用户密码'
          },
          props: true,
          component: () => import('@/view/admin/user/EditPasswordFormCard.vue')
        },
        {
          path: 'userManagerForm',
          name: 'userManagerForm',
          meta: {
            title: '用户表单'
          },
          props: true,
          component: () => import('@/view/admin/user/UserFormCard.vue')
        },
        {
          path: 'moduleManager',
          name: 'moduleManager',
          meta: {
            title: '模块管理'
          },
          component: () => import('@/view/admin/module/ModuleList.vue')
        },
        {
          path: 'moduleManagerForm',
          name: 'moduleManagerForm',
          meta: {
            title: '模块管理表单'
          },
          props: true,
          component: () => import('@/view/admin/module/ModuleFormCard.vue')
        },
        {
          path: 'moduleElementList',
          name: 'moduleElementList',
          meta: {
            title: '模块元素管理'
          },
          props: true,
          component: () =>
            import('@/view/admin/module-element/ModuleElementList.vue')
        },
        {
          path: 'moduleElementFormCard',
          name: 'moduleElementFormCard',
          meta: {
            title: '模块元素表单管理'
          },
          props: true,
          component: () =>
            import('@/view/admin/module-element/ModuleElementFormCard.vue')
        },
        {
          path: 'roleManager',
          name: 'roleManager',
          meta: {
            title: '角色权限管理'
          },
          component: () => import('@/view/admin/role/RoleList.vue')
        },

        {
          path: 'roleManagerForm',
          name: 'roleManagerForm',
          meta: {
            title: '角色表单'
          },
          props: true,
          component: () => import('@/view/admin/role/RoleFormCard.vue')
        },
        {
          path: 'signUserToRole',
          name: 'signUserToRole',
          meta: {
            title: '给角色分配用户'
          },
          props: true,
          component: () => import('@/view/admin/role/ReRoleUserList.vue')
        },
        {
          path: 'signResourceAuthorityToRole',
          name: 'signResourceAuthorityToRole',
          meta: {
            title: '给角色分配资源权限'
          },
          props: true,
          component: () => import('@/view/admin/role/ResourceAuthorityList.vue')
        },
      ]
    },
    // 服务权限管理
    {
      path: 'authManager',
      name: 'authManager',
      component: parentView,
      meta: {
        title: '服务权限管理'
      },
      children: [
        {
          path: 'serviceManager',
          name: 'serviceManager',
          meta: {
            title: '服务管理'
          },
          component: () => import('@/view/service/Index.vue')
        }
      ]
    },
    // 监控模块管理
    {
      path: 'monitorManager',
      name: 'monitorManager',
      component: parentView,
      meta: {
        title: '监控模块管理'
      },
      children: [
        {
          path: 'serviceEurekaManager',
          name: 'serviceEurekaManager',
          meta: {
            title: '服务注册中心'
          },
          component: () => import('@/view/monitor/Eureka.vue')
        },
        {
          path: 'serviceMonitorManager',
          name: 'serviceMonitorManager',
          meta: {
            title: '服务状态管理'
          },
          component: () => import('@/view/monitor/Service.vue')
        },
        {
          path: 'serviceZipkinManager',
          name: 'serviceZipkinManager',
          meta: {
            title: '服务链路管理'
          },
          component: () => import('@/view/monitor/ZipKin.vue')
        }
      ]
    }
  ]
}

const Business = {
  path: '/businessMgr',
  name: 'businessMgr',
  component: Main,
  meta: {
    title: ''
  },
  children: [
    {
      path: '/businessInfo',
      name: 'businessInfo',
      meta: {
        title: '业务信息',
        notCache: true
      },
      component: () => import('@/view/apm/business/BusinessList.vue')
    },
    {
      path: '/businessAdd',
      name: 'businessAdd',
      meta: {
        title: '新增',
        hideInMenu: true,
        inTags: false,
        notCache: true
      },
      component: () => import('@/view/apm/business/BusinessAdd.vue'),
      props: true
    }
  ]
}

const Resource = {
  path: '/resourceMgr',
  name: 'resourceMgr',
  component: Main,
  meta: {
    title: ''
  },
  children: [
    {
      path: '/resourceInfo',
      name: 'resourceInfo',
      meta: {
        title: '资源信息',
        notCache: true
      },
      component: () => import('@/view/apm/resource/ResourceList.vue')
    },
  ]
}

const Warning = {
  path: '/warningMgr',
  name: 'warningMgr',
  component: Main,
  meta: {
    title: ''
  },
  children: [
    {
      path: '/warningInfo',
      name: 'warningInfo',
      meta: {
        title: '告警信息',
        notCache: true
      },
      component: () => import('@/view/apm/warning/WarningList.vue')
    },
  ]
}

const topology = {
  path: '/topology',
  name: 'topology',
  component: Main,
  meta: {
    title: ''
  },
  children: [
    {
      path: '/topologyInfo',
      name: 'topologyInfo',
      meta: {
        title: '拓扑图列表',
        notCache: true
      },
      component: () => import('@/view/apm/topo/TopoList.vue')
    },
    {
      path: 'topoForm',
      name: 'topoForm',
      meta: {
        title: '拓扑图表单',
        notCache: true
      },
      props: true,
      component: () => import('@/view/apm/topo/TopoForm.vue')
    },
    {
      path: 'topo',
      name: 'topo',
      meta: {
        title: '拓扑图',
        notCache: true
      },
      props: true,
      component: () => import('@/view/apm/topo/Topo.vue')
    }
  ]
}

// 错误页面
const Errors = {
  path: '/error',
  name: 'errors',
  component: Main,
  children: [
    {
      path: '/401',
      name: 'error_401',
      meta: {
        hideInMenu: true,
        inTags: false
      },
      component: () => import('@/view/error-page/401.vue')
    },
    {
      path: '/500',
      name: 'error_500',
      meta: {},
      component: () => import('@/view/error-page/500.vue')
    },
    {
      path: '/403',
      name: 'error_403',
      meta: {},
      component: () => import('@/view/error-page/403.vue')
    },
    {
      path: '/no-page',
      name: 'nopage',
      component: () => import('@/view/error-page/no-page.vue')
    }
  ]
}

const Swagger = {
  path: '/swagger',
  name: 'swaggerManager',
  component: Main,
  meta: {
    title: '数据模块'
  },
  children: [
    {
      path: '/index',
      name: 'swagger',
      meta: {
        title: '数据模块'
      },
      component: () => import('@/view/swagger/SwaggerIndex.vue')
    }
  ]
}
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      inTags: false,
      notCache: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/root',
    name: 'root',
    // redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: '/uniapmConfigManager',
        name:'uniapmConfigManager',
        meta: {
          notCache: true
        },
        props:true,
        component: () => import('@/components/iframe/index')
      }
    ]
  },
  {
    path: '/fullScreen',
    name: 'fullScreen',
    meta: {
      title: '大屏',
      hideInMenu: true,
      inTags: false,
      notCache: true
    },
    component: () => import('@/view/screen/fullScreen.vue')
  },
  System,
  Errors,
  Swagger,
  Business,
  Resource,
  Warning,
  topology,
  {
    path: '*',
    name: 'error_404',
    component: parentView,
    meta: {
      hideInMenu: true,
      inTags: false
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
