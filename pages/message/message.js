import {
  createStoreBindings
} from "mobx-miniprogram-bindings";
import {
  timStore
} from "../../store/tim";
import {
  setTabBarBadge
} from "../../utils/wx";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdkReady: false,
    conversationList: [],
    // 更新会话列表
    updateConversationList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.storeBindings = createStoreBindings(this, {
      store: timStore,
      fields: ['sdkReady', 'conversationList'],
      actions: ['getConversationList']
    })
  },
  async handleTapConversation(event) {
    this.data.updateConversationList = true
    const item = event.currentTarget.dataset.item
    const user = item.userProfile
    wx.navigateTo({
      url: `/pages/conversation/conversation?targetUserId=${user.userID}&service=`,
      // 事件监听，点进会话列表后是否发送消息
      events: {
        sendMessage: () => {
          this.data.updateConversationList = false
        }
      }
    })
  },
  handleToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
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
    
    if (this.data.updateConversationList) {
      this.getConversationList()
      //使更新完会话列表后变成false
      this.data.updateConversationList = false
    }
    const unreadCount = wx.getStorageSync('unread-count')
    setTabBarBadge(unreadCount)
    const isLogin=wx.getStorageSync('isLogin')
    this.setData({
      isLogin
    })
    console.log(this.data.isLogin,'963369')
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