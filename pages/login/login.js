import User from "../../model/user"
import {createStoreBindings} from "mobx-miniprogram-bindings"
import {timStore} from "../../store/tim"
import Token from "../../model/token"

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '易选服务',
      avatar: '../../images/login/login_theme.png'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    this.storeBindings=createStoreBindings(this,{
      store:timStore,
      // 绑定的状态,绑定到this下面,this.data.sdkReady
      // 将[]变成{}映射方式改变名称action:['login']
      actions:{timLogin:'login'},
      // 绑定的操作
    })
  },

  // handleTouchInput() {
  //   
  // },
  handleLogin: async function () {
    const res = await wx.getUserProfile({
      desc: '完善用户信息',
    })
    wx.showLoading({
      title: '正在授权',
      mask:true
    })

    // 获取令牌可能会有异常处理情况需要处理,使后面的代码执行,(异常会中断后续代码的继续执行,错误不会中断后续代码的执行)

    // try用于捕获操作异常
    try {
      // 获取令牌
      await User.login()
      // 更新服务信息
      await User.updateUserInfo(res.userInfo)
      // 调用timLogin方法
      const isLogin=true
      wx.setStorageSync('isLogin', isLogin)
      await this.timLogin()
      const events=this.getOpenerEventChannel()
      // 事件通信机制
      events.emit('login')
      wx.navigateBack()
    }catch(e){
      wx.showModal({
        title:'注意',
        content:'登陆失败，请稍后重试',
        showCancel:false
      })
      console.log(e)
    }
    wx.hideLoading()
    // 返回上一页
    // wx.navigateBack()
  },

  handleToBack: function () {
    wx.switchTab({
      url:'/pages/home/home'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const verifyToken = await Token.verifyToken()
    if (verifyToken.valid) {
      const userInfo = wx.getStorageSync('userInfo')
      this.setData({
        ['userInfo.nickname']: userInfo.nickname,
        ['userInfo.avatar']: userInfo.avatar
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 取消绑定
    // 属性下面的一个方法
    this.storeBindings.destroyStoreBindings()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})