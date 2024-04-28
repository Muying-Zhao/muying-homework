import Service from "../../model/service"
import User from "../../model/user"
import Rating from "../../model/rating"
import serviceType from "../../enum/service_type";
import serviceStatus from "../../enum/service_status"
import {
  getEventParam
} from "../../utils/utils"
import serviceAction from "../../enum/service_action"
import cache from "../../enum/cache"


const rating = new Rating()

// pages/service-detail/service-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: null,
    serviceId: null,
    isPublisher: false, // 是不是服务的所有者
    ratingList: [],
    serviceTypeEnum: serviceType,
    serviceStatusEnum: serviceStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // console.log(options,777)
    this.data.serviceId = options.service_id
    await this._getService()
    await this._getServiceRatingList()
    await this._checkRole()
    // wx.getSystemInfo()是用于获取屏幕信息
    // scrawait this._checkRole()eenHeight屏高-safeArea.height安全区域
    // const system=await wx.getSystemInfo()
    // console.log(system,'5666')
  },

  async _getService() {
    const serviceInfo = await Service.getServiceById(this.data.serviceId)
    const service = serviceInfo
    //  console.log(service,'7777777777')
    this.setData({
      service
    })
  },

  async _getServiceRatingList() {
    if(this.data.service.type===serviceType.SEEK){
      return
    }

    const ratingList = await rating.reset().getServiceRatingList(this.data.serviceId)
    this.setData({
      ratingList
    })
  },

  _checkRole() {
    const userInfo = User.getUserInfoByLocal();
    // console.log(this.data.service,'886545')
    if (userInfo && userInfo.id === this.data.service.publisher.id) {
      this.setData({
        isPublisher: true
      })
    }
  },

  handleUpdate: async function (event) {
    const action = getEventParam(event, 'action')
    const content = this._generateModalContent(action)
    const res = await wx.showModal({
      title: '注意',
      content,
      showCancel: true
    })
    if (!res.confirm) {
      return
    }
    await Service.updateServiceStatus(this.serviceId, action)

    await this._getService()
  },
  handleEdit: function () {

    // 将接受到的对象转换成字符串
    const service = JSON.stringify(this.data.service)

    wx.navigateTo({
      url: `/pages/service-edit/service-edit?service=${service}`,
    })
  },
  handleChat: function () {
    const targetUserId = this.data.service.publisher.id
    const service = JSON.stringify(this.data.service)
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${service}`,
    })
  },
  handleOrder: function () {
    if (!wx.getStorageSync(cache.TOKEN)) {
      // const that=this
      wx.navigateTo({
        url: '/pages/login/login',
        events: {
          login: () => {
            // 方法一此处this转向发生改变,故定义that=this,方法二es6中可以使用箭头函数
            this._checkRole()
          }
        }
      })
      return
    }
    const service = JSON.stringify(this.data.service)
    wx.navigateTo({
      url: `/pages/order/order?service=${service}`,
    })
  },

  _generateModalContent: function (action) {
    let content
    switch (action) {
      case serviceAction.PAUSE:
        content = '暂停后服务状态变为“待发布”，' +
          '可在个人中心操作重新发布上线，' +
          '是否确认暂停发布该服务？'
        break;
      case serviceAction.PUBLISH:
        content = '发布后即可在广场页面中被浏览到，是否确认发布？'
        break;
      case serviceAction.CANCEL:
        content = '取消后不可恢复，需要重新发布并提交审核；' +
          '已关联该服务的订单且订单状态正在进行中的，仍需正常履约；' +
          '是否确认取消该服务？'
        break;
    }
    return content
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
  async onReachBottom() {
    if (!rating.hasMoreData) {
      return
    }
    const ratingList = await rating.getServiceRatingList(this.data.serviceId)
    this.setData({
      ratingList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})