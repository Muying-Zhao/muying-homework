import behavior from "../behavior";

Component({
  behaviors: [behavior],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePay: function (event) {
      this.triggerEvent('pay')
    },

    handleRefund() {
      this.triggerEvent('refund')
    },

    handleRating() {
      this.triggerEvent('rating')
    },
  }
})