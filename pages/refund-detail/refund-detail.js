import roleType from "../../enum/role-type";
import refundStatus from "../../enum/refund-status";
import {
  Refund
} from "../../model/refund";
import refundAction from "../../enum/refund-action";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: null,
    refund: null,
    RoleType: roleType,
    RefundStatus: refundStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const role = parseInt(options.role)
    const refund = JSON.parse(options.refund)
    this.setData({
      role,
      refund,
    })
  },


  handleAction: async function (event) {
    const status = event.detail.status
    const content = this._generateModalContent(status)

    const modalRes = await wx.showModal({
      title: '注意',
      content,
      showCancel: true,
    })

    if (!modalRes.confirm) return

    await this._submitUpdate(status)

    const refund = await Refund.getRefundById(this.data.refund.id)
    this.setData({
      refund
    })
  },

  _generateModalContent(action) {
    let content
    switch (action) {
      case refundAction.AGREE:
        content = '是否确认同意该服务订单的退款申请，确认后将由平台发起退款原路返回用户，不可撤销'
        break;
      case refundAction.DENY:
        content = '是否确认拒绝该服务订单的退款申请，确认取消后不可以撤销。'
        break;
    }

    return content
  },

  async _submitUpdate(status) {
    wx.showLoading({
      title: '正在提交...',
      mask: true
    })
    try {
      await Refund.updateRefundStatus(this.data.refund.id, status)
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
    }
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