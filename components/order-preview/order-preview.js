import orderStatus from "../../enum/order-status";
import roleType from "../../enum/role-type";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideTop: {
      type: Boolean,
      value: false
    },
    role: Number,
    order: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    OrderStatus: orderStatus,
    RoleType: roleType
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNavToServiceDetail() {
      const serviceId = this.data.order.service_snap.id
      console.log(serviceId,1314)
      wx.navigateTo({
        url: '/pages/service-detail/service-detail?service_id='+serviceId,
      })
    },
  }
})