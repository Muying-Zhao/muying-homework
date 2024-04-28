import orderStatus from "../../enum/order-status";
import Order from "../../model/order";
import roleType from "../../enum/role-type";
import Rating from "../../model/rating";
import orderAction from "../../enum/order-action.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    role: null,
    rating: null,
    OrderStatus: orderStatus,
    RoleType: roleType,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const order = JSON.parse(options.order)
    const role = parseInt(options.role)

    this.setData({
      order,
      role
    })
    if (order.status === orderStatus.COMPLETED) {
      this._getRating(order.id)
    }
  },


  async _getRating(orderId) {
    const rating = await Rating.getRatingByOrderId(orderId)
    this.setData({
      rating
    })
  },

  async _getOrderById() {
    const order = await Order.getOrderById(this.data.order.id)
    this.setData({
      order,
    })
  },

  handleToChat: function (event) {
    const {
      targetUserId
    } = event.detail
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(this.data.order.service_snap)}`
    })
  },

  handleRefund() {
    // 跳转售后服务页面
    wx.navigateTo({
      url: `/pages/refund/refund?order=${JSON.stringify(this.data.order)}`
    })
  },

  handleRating() {
    // 跳转评价页面
    wx.navigateTo({
      url: `/pages/rating/rating?order=${JSON.stringify(this.data.order)}`,
      events: {
        rating: () => {
          this._getOrderById()
          this._getRating(this.data.order.id)
        }
      },
    })
  },

  async handlePay() {
    const modalRes = await wx.showModal({
      title: '注意',
      content: `您即将支付该服务费用：￥${this.data.order.price}元，是否确认支付`,
      showCancel: true,
    })
    if (!modalRes.confirm) return
    // 模拟支付后订单状态改变
    await Order.updateOrderStatus(this.data.order.id, orderAction.PAY)
    // 跳转支付成功页面
    wx.navigateTo({
      url: '/pages/pay-success/pay-success'
    })
    this._getOrderById()
  },

  async handleUpdateOrderStatus(event) {
    const action = event.detail.action;
    const content = this._generateModalContent(action);

    const modalRes = await wx.showModal({
      title: '注意',
      content,
      showCancel: true,
    })

    if (!modalRes.confirm) return

    wx.showLoading({
      title: '正在提交...',
      mask: true
    })
    try {
      await Order.updateOrderStatus(this.data.order.id, action)
    } catch (e) {
      return
    }
    wx.hideLoading()
    this._getOrderById()
  },

  _generateModalContent(action) {
    let content
    switch (action) {
      case orderAction.AGREE:
        content = '是否确认同意本次服务预约，同意后不可以撤销。'
        break;
      case orderAction.DENY:
        content = '是否确认拒绝本次服务预约，同意后不可以撤销。'
        break;
      case orderAction.CONFIRM:
        content = '是否确认本次服务已完成？'
        break;
      case orderAction.CANCEL:
        content = '是否确认取消本次服务订单，确认取消后不可以撤销。'
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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})