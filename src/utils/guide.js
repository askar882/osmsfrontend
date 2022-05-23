import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
const guideKey = 'GUIDED'
const guideSteps = [
  {
    element: '#hamburger-container',
    popover: {
      title: 'Hamburger',
      description: '打开/关闭侧边栏。',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '面包屑',
      description: '显示当前页面的路径，快速返回之前的任意页面。',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: '页面搜索',
      description: '搜索需要的页面，快速导航。',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏',
      description: '全屏显示页面。',
      position: 'left'
    }
  },
  {
    element: '#size-select',
    popover: {
      title: '切换全局组件尺寸',
      description: '设置Element UI组件的默认尺寸。',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '标签页',
      description: '显示已浏览的页面列表。',
      position: 'bottom'
    },
    padding: 0
  }
]

let driver = new Driver()

export function isGuided() {
  return !!localStorage.getItem(guideKey)
}

export function guide() {
  if (!driver) {
    driver = new Driver()
  }
  driver.defineSteps(guideSteps)
  driver.start()
  localStorage.setItem(guideKey, true)
}
