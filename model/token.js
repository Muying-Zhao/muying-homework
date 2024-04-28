// import {wxToPromise} from "../utils/wx";
// import APIConfig from "../config/api";
import authUserinfo from "../enum/auth-userinfo";
// import Http from "../utils/http";

class Token {

  static tokenUrl = 'v1/token'

  static async getToken() {

    // const res = await wxToPromise('request', {
    //     url: `${APIConfig.baseUrl}/${this.tokenUrl}`,
    //     data: {
    //         i_code: APIConfig.iCode,
    //         order_no: APIConfig.orderNo
    //     },
    //     method: 'POST'
    // })

    // wx.setStorageSync('token', res.data.token)

    // token=159cb2e40821a382d72338e57b3ca999
    return '159cb2e40821a382d72338e57b3ca999'
  }

  // 验证令牌是否有效
  static async verifyToken() {
    const token = wx.getStorageSync('token');
    // return await Http.request({
    //     url: `${Token.tokenUrl}/verify`,
    //     data: { token },
    //     method: 'POST'
    // })

    // verifyToken
    return {
      valid: true
    }
  }

  static async getAuthUserInfoStatus() {
    const setting = await wx.getSetting({})
    const userInfoSetting = await setting.authSetting['scope.userInfo']
    if (userInfoSetting === undefined) {
      return authUserinfo.NOT_AUTH
    }
    if (userInfoSetting === false) {
      return authUserinfo.DENY
    }
    if (userInfoSetting === true) {
      return authUserinfo.AUTHORIZED
    }
  }
}

export default Token