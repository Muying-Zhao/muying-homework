import {
  setTabBarBadge
} from "../../utils/wx";
import Token from "../../model/token"
import {
  appointWithMeGrid,
  myAppointGrid,
  myProvideGird,
  mySeekGrid
} from "../../config/grid";
import serviceType from "../../enum/service_type";
import roleType from "../../enum/role-type";


import Service from "../../model/service";
import Order from "../../model/order";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '点击授权登录',
      avatar: '../../images/login/login.png'
    },
    // 状态展示
    appointWithMeStatus: null,
    myAppointStatus: null,
    provideServiceStatus: null,
    seekServiceStatus: null,

    // 宫格配置
    // 预约我的宫格
    appointWithMeGrid: appointWithMeGrid,
    // 我的预约宫格
    myAppointGrid: myAppointGrid,
    // 我在提供宫格
    myProvideGird: myProvideGird,
    // 正在找宫格
    mySeekGrid: mySeekGrid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },


  handleCheck:function(event){
    console.log(event)
  },
  /**
   * @return void
   */
  async _getOrderStatus() {
    // 发布者订单状态
    const appointWithMeStatus = await Order.getOrderStatus(roleType.PUBLISHER);
    // 作为消费者
    const myAppointStatus = await Order.getOrderStatus(roleType.CONSUMER);
    this.setData({
      appointWithMeStatus:   appointWithMeStatus,
      myAppointStatus:   myAppointStatus
    })
  },
  // CONSUMER

  /**
   * @return void
   */
  async _getServiceStatus() {
    // 我发布的
    const provideServiceStatus = Service.getServiceStatus(serviceType.PROVIDE);
    // 正在找的
    const seekServiceStatus = Service.getServiceStatus(serviceType.SEEK);
    this.setData({
      provideServiceStatus: await provideServiceStatus,
      seekServiceStatus: await seekServiceStatus
    })
  },

  handleNavToMyOrder(event) {
    const cell = event.detail.cell
    // 售后退款不携带status，查看全部的status=-1
    if (!('status' in cell)) {
      wx.navigateTo({
        // 售后退款
        url: `/pages/refund-list/refund-list?role=${cell.role}`
      })
      return
    }
    wx.navigateTo({
      url: `/pages/my-order/my-order?role=${cell.role}&status=${cell.status}`
    })
  },

  handleNavToMyService(event) {
    const {
      type,
      status
    } = event.detail.cell
    wx.navigateTo({
      url: `/pages/my-service/my-service?type=${type}&status=${status}`
    })
  },

  handleToLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
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
    const unreadCount = wx.getStorageSync('unread-count')
    setTabBarBadge(unreadCount)
    const isLogin=wx.getStorageSync('isLogin')
    const verifyToken = await Token.verifyToken()
    if (verifyToken.valid) {
      const userInfo = wx.getStorageSync('userInfo')
      this.setData({
        ['userInfo.nickname']: userInfo.nickname,
        ['userInfo.avatar']: userInfo.avatar,
        isLogin
      })
      this._getOrderStatus()
      this._getServiceStatus()
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