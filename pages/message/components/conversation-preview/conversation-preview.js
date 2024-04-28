import {
  formatTime
} from "../../../../utils/date";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    user: Object,
    lastMessage: Object,
    unreadCount: Number
  },
  observers: {
    'lastMessage': function (lastMessage) {
      lastMessage.lastTime = formatTime(lastMessage.lastTime)
      this.setData({
        _lastMessage: lastMessage
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _lastMessage: null
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})