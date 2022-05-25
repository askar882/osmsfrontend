import { login, getUser } from '@/api/user'
import { getToken, setToken, removeToken, extractToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  id: '',
  expiration: '',
  roles: [],
  creation: '',
  modification: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EXPIRATION: (state, expiration) => {
    state.expiration = expiration
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CREATION: (state, creation) => {
    state.creation = creation
  },
  SET_MODIFICATION: (state, modification) => {
    state.modification = modification
  }
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const response = await login({ username: username.trim(), password: password })
    const { token } = response.data
    commit('SET_TOKEN', token)
    setToken(token)
  },

  // 获取用户信息
  async getInfo({ commit, state }) {
    const userData = extractToken()
    const { name, roles, id, expiration } = userData
    commit('SET_ROLES', roles)
    commit('SET_NAME', name)
    commit('SET_ID', id)
    commit('SET_EXPIRATION', expiration)
    const userInfo = await getUser(id)
    const { creationTime: creation, modificationTime: modification } = userInfo.data.user
    commit('SET_CREATION', creation)
    commit('SET_MODIFICATION', modification)
    return userData
  },

  // 登出
  async logout({ commit, state, dispatch }) {
    await dispatch('resetToken')
    resetRouter()
    // 清除已访问的以及缓存的View
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // 删除Token
  async resetToken({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_NAME', '')
    commit('SET_ID', '')
    commit('SET_EXPIRATION', '')
    commit('SET_CREATION', '')
    commit('SET_MODIFICATION', '')
    removeToken()
  },

  // dynamically modify permissions
  // TODO: DELETE
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
