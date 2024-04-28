import Order from "../../model/order.js";

// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: null,
    address: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 将字符串转回对象
    const service = JSON.parse(options.service);
    this.setData({
      service
    })
  },

  handleSelectAddress:async function () {
    const address=  await wx.chooseAddress() 
    this.setData({
      address
    })
  },

  handleOrder:async function () {
    if(this.data.service.designated_place&&!this.data.address){
      wx.showModal({
        title: '错误',
        content: '该服务必须指定服务地点',
        showCancel:false
      })
      return
    }

    const res=await wx.showModal({
      title: '注意',
      content: '是否确认预约该服务',
    })
    if(!res.confirm){
      return
    }

    wx.showLoading({
      title: '正在预约',
      // 遮罩，放置用户重复点击
      mask:true
    })

    // 处理异常情况
    try{
      await Order.createOrder(this.data.service.id,this.data.address)
      wx.navigateTo({
        url: '/pages/order-success/order-success',
      })
    }catch(e){
      wx.showModal({
        title: '错误',
        content: '预约失败，请稍后重试',
      })
       console.log(e)
    }
    wx.hideLoading()
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