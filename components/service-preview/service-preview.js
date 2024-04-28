import serviceType from "../../enum/service_type";

// components/service-preview/service-preview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    service: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    serviceTypeEnum: serviceType
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelect() {
      this.triggerEvent('select', {
        service: this.properties.service
      })
      console.log(this.properties.service,364)
    }
  }
})