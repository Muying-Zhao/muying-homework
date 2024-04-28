import Token from "./model/token";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { timStore } from "./store/tim";

// app.js
App({
  // 将每次重置登录换成检验token是否有效自动登录
  // onLaunch() {
  //   // 展示本地存储能力
  //   const logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  // },
  // globalData: {
  //   userInfo: null
  // }

  // 验证令牌是否有效
  async onLaunch() {
    const res = await Token.verifyToken();
    const storeBindings = createStoreBindings(this, {
      store: timStore,
      actions: ['login'],
    })
    if (res.valid) {
      await this.login()
    }

    storeBindings.destroyStoreBindings()
  }
})

/**
 * <swiper class="category_swiper" display-multiple-items="{{2}}" next-margin="60rpx">
        <!--swiper-item的class不生效  -->
        <swiper-item wx:for="{{categoryList}}" wx:key="index">
          <view class="category_swiper_item" bindtap="handleClickSwiper" data-id="{{item.id}}">
            <text class="category_swiper_item_txt">{{item.name}}</text>
          </view>
        </swiper-item>
      </swiper>
 */