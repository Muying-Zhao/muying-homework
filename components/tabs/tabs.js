import {
  throttle
} from "../../utils/utils"
// throttle函数节流
// components/tabs/tabs.js
Component({
  // 组件里放插槽和又一组件的插槽，这时需用加上name来辨别slot，并且自定义多插槽方式options
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
    },
    active: {
      type: Number,
      value: 0
  },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTabsIndex: 0,
  },

  observers: {
    active: function (value) {
        this.setData({
            currentTabsIndex: this.data.active
        })
    }
},
  /**
   * 组件的方法列表
   */
  methods: {
    handleClickTabs: throttle(
      function (event) {
        // console.log(event.currentTarget.dataset.index,'65445')
        const index = event.currentTarget.dataset.index
        // 消去重复点击同一事件
        if (index === this.data.currentTabsIndex) {
          return
        }
        // 获取数据进行更改
        this.setData({
          currentTabsIndex: index
        })
        // this.triggerEvent(name:'change',detail:{index})原代码有问题
        this.triggerEvent('change', {
          index
        })
        // triggerEvent不被定义有问题
        // console.log(this.triggerEvent.detail,'777')
      }
    ),

    handleTouchMove: function (event) {
      // console.log(event)
      // 0,-1,1
      const direction = event.direction
      const currentTabsIndex = this.data.currentTabsIndex
      const targetTabIndex = currentTabsIndex + direction
      // 假如为-1和3时不存在所以得判断,return中止
      if (targetTabIndex < 0 || targetTabIndex > this.data.tabs.length - 1) {
        return
      }
      // 定义一个对象
      const customEvent = {
        currentTarget: {
          dataset: {
            index: targetTabIndex
          }
        }
      }
      this.handleClickTabs(customEvent)
    },

    // handleTouchstart:function (event) {
    //   console.log(event)
    // },
    // handleTouchend:function (event) {
    //   console.log(event)
    // },
  }
})
// 1、传入一个数组。按数组元素内容渲染我们的标签页选项
// 2、能够监听点击事件，并且通知使用组件的页面或者父组件，通过事件通知我们选择了什么
// 通用组件
// 父组件（页面）通过属性给自定义组件传递参数
// 自定义组件爱你通过自定义事件给父组件(页面)传递参数