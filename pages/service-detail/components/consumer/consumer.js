import serviceType from "../../../../enum/service_type";
import behavior from "../behavior"

Component({
  behavior:[behavior],
  /**
   * 组件的属性列表
   */
  properties: {},
  // properties: {
  //   service: Object
  // },

  /**
   * 组件的初始数据
   */
  data: {
    serviceTypeEnum:serviceType
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChat:function (event) {
      // console.log(event,'1')
      this.triggerEvent('chat')
    },
    handleOrder:function (event) {
      // console.log(event,'2')
      this.triggerEvent('order')
    }
  }
})