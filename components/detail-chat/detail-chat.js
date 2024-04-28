// components/detail-chat/detail-chat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: Object,
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
    handleToChat() {
      const targetUserId = this.data.userInfo.id
      this.triggerEvent('chat', {
        targetUserId
      })
    }
  }
})