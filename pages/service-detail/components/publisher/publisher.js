import serviceStatus from "../../../../enum/service_status";
import serviceAction from "../../../../enum/service_action";
import behavior from "../behavior";
import {getDataSet} from "../../../../utils/utils"

Component({
  // Behavior特有的
  behaviors:[behavior],
  /**
   * 组件的属性列表
   */
  properties: {},
  // properties: {
  //   service:Object
  // },

  /**
   * 组件的初始数据
   */
  data: {
    serviceStatusEnum:serviceStatus,
    serviceActionEnum:serviceAction
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleUpdateStatus:function (event) {
      // console.log(event,'666')
      const action=getDataSet(event,'action')
      // triggerEvent方法触发指定对象的指定事件，并且立即执行该事件中的脚本
      this.triggerEvent('update',{action})
    },
    handleEditService:function (event) {
      // console.log(event,'event1')
      this.triggerEvent('edit')
    }
  }
})
