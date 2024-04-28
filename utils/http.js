/**
 * @Created by WebStorm
 * @Author:炑焸
 * @Desc:
 */
import APIConfig from "../config/api"
import exceptionMessage from "../config/exception-message"
import {wxToPromise} from "./wx"
import cache from "../enum/cache"
import User from "../model/user"

import {createStoreBindings} from "mobx-miniprogram-bindings"
import {timStore} from "../store/tim"

class Http {
  // 使用静态static方法后，实例化时不需要使用new
  static async request({
    url,
    data,
    method = 'GET',
    refetch=true
  }) {
    let res
    try{
      res = await wxToPromise('request', {
        url: APIConfig.baseUrl + url,
        data,
        method,
        // 接受令牌
        header:{
          token:wx.getStorageSync(cache.TOKEN)
        }
      })
      // console.log(res,'res')
    }catch(e){
      Http._showError(-1)
      throw new Error(e.errMsg)
    }
    // console.log(res.data.error_code, res.data.message,'67894')
    // Http._showError(res.data.error_code, res.data.message)
    // res.statusCode=500
    if (res.statusCode < 400) {
      return res.data.data
    }
    // TODO请求失败
    if (res.statusCode === 401) {

      this.storeBindings=createStoreBindings(this,{
        store:timStore,
        felds:['sdkReady'],
        // logout退出登录
        actions:{timLogout:'logout'},
      })

      // TODO令牌相关操作
      if(res.data.error_code===10001){
        // 如果失败了退出登录
        if(this.sdkReady){
          this.timLogout()
        }
        wx.navigateTo({
          url: 'pages/login/login',
        })
        throw Error('请求未携带令牌')
      }
      // 实现了一个自动刷新令牌，重新执行业务逻辑
      if(refetch){
        return await Http._refetch({url,data,method,refetch})
      }
      // 如果二次请求失败了退出登录
      if(this.sdkReady){
        this.timLogout()
      }
    }
    console.log(res.data,'8888')
    Http._showError(res.data.error_code, res.data.message)
    const error = Http._generateMessage(res.data.message)

    throw Error(error)

    // wx.request({
    //   url:APIConfig.baseUrl+url,
    //   data,
    //   method,
    //   success:(res)=>{
    //     console.log(res)
    //     // 全局统一响应、异常处理
    //     // T0D0 请求成功
    //     if(res.statusCode<400){
    //       console.log(res.data.data,'5555')
    //       callback(res.data.data)
    //       return res.data.data
    //     }
    //     // TOD0 请求失败
    //     if(res.statusCode ===401){
    //       // TODO 令牌相关操作
    //       return
    //     }
    //     // 接口错误信息，一定要看清楚文档，哪些适合直接展示出去，哪些不适合
    //     Http._showError(res.data.error_code,res.data.message)
    //   }
    // })
  }

  static async _refetch(data){
    await User.login()
    data.refetch=false
    return await Http.request(data)
  }

  static _showError(errorCode, message='') {
    let title = ''
    const errorMessage = exceptionMessage[errorCode]
    title = errorMessage || message || '未知异常'
    title = Http._generateMessage(title)
    // console.log(errorMessage)
    wx.showToast({
      title,
      icon: 'none',
      // duration错误展示3s
      duration: 3000
    })
  }

  static _generateMessage(message){
    return typeof message === 'object' ?
      Object.values(message).join(';') :
      message
  }
}

export default Http