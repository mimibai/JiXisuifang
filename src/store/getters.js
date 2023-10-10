const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // token
  token: state => state.user.token,
  // 终端问卷token
  terminalToken: state => state.terminal.terminalToken,
  // 终端医院终端信息
  terminalHospitalInfo: state => state.terminal.terminalHospitalInfo,
  // 用户信息
  name: state => state.user.name,
  userId: state => state.user.userId,
  avatar: state => state.user.avatar,
  mobileNumber: state => state.user.mobileNumber,
  hospitalName: state => state.user.hospitalName,
  hospitalId: state => state.user.hospitalId,
  email: state => state.user.email,
  userIdentityId: state => state.user.userIdentityId,
  // 权限
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
