export default {
  setUserAlertConfig: "/malenia/user-alert-config post query", //
  getUserAlertConfig: "/malenia/user-alert-config get", //
  userQuota: "/malenia/user-info/setupQuota get", // 设置 quota

  removeConfig: "/malenia/sys-config/removeConfig get", // removeConfig
  triggerBoardCast: "/malenia/proxy-server-node/triggerBoardCast post", // triggerBoardCast



  // admin
  // operator-controller
  userLogin: "/malenia/admin-op/travelToUser get", // 模拟登录
  rechargeUser: "/malenia/admin-op/rechargeUser get", // 用户充值
  userAdd: "/malenia/admin-op/createUser get", // 创建用户
  userList: "/malenia/admin-op/listUser get", // 用户列表
  setConfig: "/malenia/admin-op/setConfig get", // config 单条
  setConfigs: "/malenia/admin-op/setConfigs post", // config all
  allConfig: "/malenia/admin-op/allConfig get", // 所有 config
  listServer: "/malenia/admin-op/listServer get", // 列出 server
  setServerStatus: "/malenia/admin-op/setServerStatus get", // 设置服务器状态
  modifyOrderBandwidthLimit: "/malenia/admin-op/modifyOrderBandwidthLimit get", // 修改价格
  grantAdmin: "/malenia/admin-op/grantAdmin get", // 模拟登录

  // product-config-controller
  purchaseUpdateStatus: "/malenia/admin-config/updateStatus get", // 禁用产品
  updateStatus: "/malenia/admin-config/updateStatus get", // 代理产品生效状态
  listAllIpResources: "/malenia/admin-config/getAllIpSources get", // 全部代理Ip资源
  listSupportProcessor: "/malenia/admin-config/listSupportProcessor get", // 模板返回值
  addOrUpdateIpResource: "/malenia/admin-config/addOrUpdateIpSource post", // 新增代理Ip资源
  getUserPrivateProducts :"/malenia/admin-config/getUserPrivateProducts get", // 获取所有用户的私有产品列表
  addOrUpdate: "/malenia/admin-config/addOrUpdateProduct post", // 新增/更新代理产品
  savePrivateProductRelation: "/malenia/admin-config/addUserToPrivateProduct get", // 关联用户到私有产品
  removePrivateProductRelation: "/malenia/admin-config/removePrivateProductRelation get", // 移除用户私有产品
  listProductIpSources: "/malenia/admin-config/listAllIpSource get", // 获取产品下的代理Ip资源
  addSourceToProduct: "/malenia/admin-config/addSourceToProduct get", // 添加代理Ip资源到产品
  deleteProductResource: "/malenia/admin-config/deleteSourceToProduct get", // 删除产品中的代理IP资源
  getUserPrivateProductIds: "/malenia/admin-config/getPrivateProductIds get", // 获取用户私有产品
  // report-controller
  adminFetchMetric: "/malenia/admin-report/fetchMetric", // 获取指标
  adminGetMetricNames: "/malenia/admin-report/getMetricNames", // 获取指标名称
  usageTopTen: "/malenia/admin-report/topTenUser get", // top 10
  logList: "/malenia/admin-report/listSystemLog get", // 日志
  rechargeRecordsList:"/malenia/admin-report/listRechargeRecords get",

  // user
  login: "/malenia/user-info/login post query", // 登录
  register: "/malenia/user-info/register post query", // 注册
  getUser: "/malenia/user-info/userInfo get", // 获取用户信息
  updatePassword: "/malenia/user-info/resetPassword post query", // 修改密码
  refreshToken: "/malenia/user-info/refreshToken get", // 刷新 token
  regenerateAPIToken: "/malenia/user-info/regenerateAPIToken get", // 刷新 api token

  setAuth: "/malenia/user-op/setupAuthAccount get", // 设置 auth 账号
  whiteList: "/malenia/user-op/listAuthWhiteIp get", // 白名单列表
  whiteListAdd: "/malenia/user-op/addWhiteIp get", // 白名单新增
  whiteListDelete: "/malenia/user-op/deleteAuthWhiteIp get", // 白名单删除
  switchBalanceMethod: "/malenia/user-op/switchBalanceMethod get", // 切换产品计费模式
  listAsset: "/malenia/user-op/listAsset get", // 资产文件列表
  uploadAsset: "/malenia/user-op/uploadAsset form", // 新增资产文件
  deleteAsset: "/malenia/user-op/deleteAsset get", // 删除资产文件
  listMitmScript: "/malenia/user-op/listMitmScript get", // Mitm列表
  addOrUpdateMitmScript: "/malenia/user-op/addOrUpdateMitmScript post", // 修改Mitm
  removeMitmScript: "/malenia/user-op/removeMitmScript get", // 删除Mitm
  purchase: "/malenia/user-op/purchase get", // 购买代理产品


  mitmLogs: "/malenia/user-report/mitmLogs", // Mitm 拦截日志
  listAllOrders: "/malenia/user-report/listOrder get", // 已购买产品订单列表
  billList: "/malenia/user-report/listBill get", // 订购流水
  listAllProducts: "/malenia/user-report/listAllProducts get", // 全量代理产品列表
  userFetchMetric: "/malenia/user-report/fetchMetric", // 获取指标
  userGetMetricNames: "/malenia/user-report/getMetricNames", // 获取指标名称
  // notice
  notice: "/malenia/system-info/notice get", // 系统通知

  // 授权信息
  getIntPushMsg: "/yint-stub/certificate/getIntPushMsg get", // 授权信息
  getNowCertificate: "/yint-stub/certificate/getNowCertificate get" // 授权证书

}
