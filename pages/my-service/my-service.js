import Service from "../../model/service";
const serviceModel = new Service()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: {
      hideTabsLoading: false,
      hideServiceLoading: false,
    },
    tabs: ['全部服务', '待审核', '待发布', '已发布'],
    currentTabIndex: 0,
    type: null,
    status: null,
    showStatus: false,
    serviceList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // status: '-1':全部  0：待审核、1、待发布、 2 已发布
    // tabs:    0：全部  1：待审核、 2、待发布、 3 已发布
    let status = parseInt(options.status)
    this.setData({
      currentTabIndex: status + 1
    })
    this.data.status = status < 0 ? '' : status
    this.data.type = options.type
    this._getServiceList()
  },

  /**
   * @returns {void}
   * @private
   */
  async _getServiceList() {
    this.setData({
      ['loading.hideServiceLoading']: false,
    })
    const serviceList = await serviceModel.reset().getMyServiceList(this.data.type, this.data.status)
    this.setData({
      ['loading.hideServiceLoading']: true,
      serviceList
    })
  },

  handleTabChange: async function (event) {
    const index = event.detail.index
    this.setData({
      currentTabIndex: index,
    })

    this.data.status = index < 1 ? '' : index - 1
    this._getServiceList()
  },

  async handleSelect(event) {
    const service = event.detail.service;
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?service_id=${service.id}`
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
    this._getServiceList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!serviceModel.hasMoreData) {
      return
    }
    const myServiceList = await serviceModel.getMyServiceList(this.data.type, this.data.status);
    this.setData({
      myServiceList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})