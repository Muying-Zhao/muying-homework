import Order from "../../model/order";
import orderStatus from "../../enum/order-status";
import roleType from "../../enum/role-type";

const orderModel = new Order()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: {
      hideTabsLoading: false,
      hideOrderLoading: false,
    },
    tabs: ['全部订单', '待同意', '待支付', '待确认', '待评价'],
    currentTabsIndex: 0,
    orderList: [],
    orderStatus,
    roleType,
    role: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // status: -1:全部  0：待同意、1:待支付、2：待确认、3：待评价
    // tabs:    0：全部  1：待同意、 2、待支付、 3 待确认 4 待评价
    const status = parseInt(options.status)
    const role = parseInt(options.role)
    wx.setNavigationBarTitle({
      title: role === roleType.PUBLISHER ? '预约我的' : '我的预约'
    })
    this.setData({
      currentTabsIndex: status + 1,
      role
    })
    this.data.status = status < 0 ? '' : status

  },


  handleTabChange: async function (event) {

    const index = event.detail.index
    this.data.status = index < 1 ? '' : index - 1
    this.setData({
      currentTabsIndex: index,
    })

    await this._getOrderList()
  },

  async _getOrderList() {

    this.setData({
      ['loading.hideOrderLoading']: false,
    })
    
    const orderList = await orderModel.reset().getMyOrderList(this.data.role, this.data.status)

    this.setData({
      ['loading.hideOrderLoading']: true,
      orderList: orderList,
    })
  },

  handleNavDetail(event) {
    const order = event.detail.order

    wx.navigateTo({
      url: `/pages/order-detail/order-detail?role=${this.data.role}&order=${JSON.stringify(order)}`
    })
  },

  handleRefund(event) {
    const order = event.detail.order
    wx.navigateTo({
      url: `/pages/refund/refund?order=${JSON.stringify(order)}`
    })
  },

  handleChat(event) {
    const {
      order
    } = event.detail
    const targetUserId = order[this.data.role === roleType.PUBLISHER ? 'consumer' : 'publisher'].id

    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${targetUserId}&service=${JSON.stringify(order.service_snap)}`
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
  onShow() {
    this._getOrderList()
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
  async onPullDownRefresh() {
    await this._getOrderList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!orderModel.hasMoreData) {
      return
    }
    const orderList = await orderModel.getMyOrderList(this.data.role, this.data.status);
    this.setData({
      orderList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})