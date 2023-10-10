// 终端秘钥登录
import {
  getCookieToken,
  setCookieToken
} from '@/utils/cookie'
import Cookies from 'js-cookie'
const TOKEN_KEY = 'terminalToken'
const getDefaultState = () => {
  return {
    terminalToken: getCookieToken(TOKEN_KEY),
    terminalHospitalInfo: Cookies.get('terminalHospitalInfo') ? Cookies.get('terminalHospitalInfo') : {}
  }
}
const state = getDefaultState()
const mutations = {
  SET_TERMINAL_TOKEN: (state, token) => {
    state.terminalToken = token
  },
  SET_TERMINAL_HOSPITALINFO: (state, terminalHospitalInfo) => {
    Cookies.set('terminalHospitalInfo', terminalHospitalInfo)
    state.terminalHospitalInfo = terminalHospitalInfo
  }
}
const actions = {
  saveTerminalToken({
    commit
  }, terminalToken) {
    return new Promise(resolve => {
      commit('SET_TERMINAL_TOKEN', terminalToken)
      setCookieToken(TOKEN_KEY, terminalToken)
      resolve()
    })
  },
  saveterminalHospitalInfo({
    commit
  }, terminalHospitalInfo) {
    return new Promise(resolve => {
      commit('SET_TERMINAL_HOSPITALINFO', terminalHospitalInfo)
      console.log('223', terminalHospitalInfo)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
