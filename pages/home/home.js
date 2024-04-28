import Category from "../../model/category";
import Service from "../../model/service"
import { throttle } from "../../utils/utils";
import { setTabBarBadge } from "../../utils/wx";

const service = new Service();

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部服务", "在提供", "正在找", ],
    categoryList: [],
    tabIndex: 0,
    categoryId: 0,
    loading:true,
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function(options) {
    // // 使用单例模式后就不需要用new Tim()来实例了
    // Tim.getInstance()
    await this._getServiceList()
    await this._getCategoryList()
    this.setData({
      loading:false
    })
  },

  handleSelectedService:function (event) {
    const service=event.currentTarget.dataset.service
    // 1、缓存，存在数据不一致问题
    // 2、只传入一个ID，然后跳转的目标页面根据这个id发起一个请求获取数据
    wx.navigateTo({
      url: '/pages/service-detail/service-detail?service_id='+service.id,
    })
    // this.setData({
    //   service: service
    // })
  },

  handleClickTabs: function (event) {
    const tabIndex = event.detail.index
    this.data.tabIndex = tabIndex
    this._getServiceList()
  },
  handleClickSwiper:throttle(
    function (event) {
      if (this.data.categoryId === event.currentTarget.dataset.id) {
        return
      }
      const categoryId = event.currentTarget.dataset.id
      this.data.categoryId = categoryId
      this._getServiceList() // 
    }
  ) ,
  async _getServiceList() {
    // 发起网络请求，获取服务列表的数据
    // wx.request({})
    const serviceList = await service.reset().getServiceList(this.data.categoryId,this.data.tabIndex)
    // 模型
    this.setData({
      serviceList: serviceList
    })
  },
  async _getCategoryList() {
    const categoryList = await Category.getCategoryListWithList()
    this.setData({
      categoryList
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
    const unreadCount = wx.getStorageSync('unread-count')
    setTabBarBadge(unreadCount)
    const isLogin=this.data.isLogin
    wx.setStorageSync('isLogin',isLogin)
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
    console.log('下拉刷新')
    // const service=new Service
    // service.getServiceList()
    // const serviceList=await service.reset().getServiceList()
    // this.setData({
    //   serviceList
    // })
    this._getServiceList()
    // 实现后关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!service.hasMoreData) {
      return
    }
    const serviceList = await service.getServiceList(this.data.categoryId, this.data.tabIndex)
    console.log('上拉触底')
    this.setData({
      serviceList
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})