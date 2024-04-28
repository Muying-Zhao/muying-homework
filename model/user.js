import Http from '../utils/http'
import Token from './token'
import cache from '../enum/cache'
import {genTestUserSig} from '../lib/debug/GenerateTestUserSig';

// 获取本地服务信息
class User {
  static getUserInfoByLocal() {
    return wx.getStorageSync(cache.USER_INFO)
  }

  static async login() {
    // 获取令牌
    const token = await Token.getToken()
    wx.setStorageSync(cache.TOKEN, token)
    wx.setStorageSync('isLogin', true)
  }

  static async getUserInfo() {
    const userInfo = await Http.request({
      url: 'v1/user'
    })
    if (userInfo) {
      return userInfo
    } else {
      return null
    }
  }
  static async getUserSign() {
    // return await Http.request({
    //     url: 'v1/user/sign'
    // })
    const user = wx.getStorageSync('userInfo')
    const userSig = genTestUserSig({
      userID: String(user.id),
      SDKAPPID: 1600006050, // Your SDKAppID
      SECRETKEY: '12b4053c4b1416b07d94acacb6aa7e99054a4ff841793ee5d47feb6c84d28bfa', // Your secretKey
      EXPIRETIME: 604800,
    }).userSig
    return {
      'sign': userSig,
      'user_id': String(user.id),
    }
  }

  static async updateUserInfo(data) {
    const res = await Http.request({
      url: 'v1/user',
      data: {
        nickname: data.nickName,
        avatar: data.avatarUrl,
        gender: data.gender
      },
      method: 'PUT'
    });
    wx.setStorageSync('userInfo', res)
  }

}

export default User