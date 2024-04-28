import {
  Refund
} from "../../model/refund";
// import roleType from "../../enum/role-type";
import refundStatus from "../../enum/refund-status";

const refundModel = new Refund()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['待同意', '处理中', '全部记录'],
    currentTabIndex: 0,
    refundList: [],
    loading: false,
    RefundStatus: refundStatus,
    role: null,
    showStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const role = parseInt(options.role)
    this.setData({
      role,
    })
  },


  handleTabChange: async function (event) {
    const index = event.detail.index
    this.setData({
      currentTabIndex: index,
    })
    await this.getRefundList(index)
  },

  handleNavToRefundDetail(event) {
    const refund = event.currentTarget.dataset.refund
    wx.navigateTo({
      url: `/pages/refund-detail/refund-detail?role=${this.data.role}&refund=${JSON.stringify(refund)}`
    })
  },

  async getRefundList(index) {
    switch (index) {
      case 0:
        await this._getInitRefundList(refundStatus.UNAPPROVED)
        break;
      case 1:
        await this._getProcessingRefundList()
        break;
      case 2:
        await this._getInitRefundList()
        break;
    }
  },

  async _getInitRefundList(status = '') {
    this.setData({
      loading: true,
      showStatus: false,
    })
    const refundList = await refundModel.reset().getRefundListByStatus(this.data.role, status)
    this.setData({
      loading: false,
      showStatus: !refundList.length,
      refundList,
    })
  },

  async _getProcessingRefundList() {
    this.setData({
      loading: true,
      showStatus: false,
    })
    const refundList = await refundModel.reset().getProcessingRefundList(this.data.role)
    this.setData({
      loading: false,
      showStatus: !refundList.length,
      refundList,
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
  onShow: function () {
    this.getRefundList(this.data.currentTabIndex)
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

    await this.getRefundList(this.data.currentTabIndex)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!refundModel.hasMoreData) {
      return
    }

    let refundList

    switch (this.data.currentTabIndex) {
      case 0:
        refundList = await refundModel.getRefundListByStatus(this.data.role, refundStatus.UNAPPROVED)
        break;
      case 1:
        refundList = await refundModel.getProcessingRefundList(this.data.role)
        break;
      case 2:
        refundList = await refundModel.getRefundListByStatus(this.data.role, '')
        break;
    }
    this.setData({
      refundList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})