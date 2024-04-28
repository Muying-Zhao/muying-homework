import refundStatus from "../../../../enum/refund-status";
import refundAction from "../../../../enum/refund-action";


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: Number
},

  /**
   * 组件的初始数据
   */
  data: {
    RefundStatus: refundStatus,
    refundAction: refundAction
},

  /**
   * 组件的方法列表
   */
  methods: {
    handleAction(event) {
        const status = event.currentTarget.dataset.status
        this.triggerEvent('action', { status })
    }
}
})
