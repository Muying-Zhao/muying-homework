// 使用promise解决回调地狱问题
function wxToPromise(method,options={}) {
  return new Promise((resolve,reject)=>{
    options.success=resolve
    options.fail=err=>{
      reject(err)
    }
    wx[method](options)
  })
}

/**
 * @param unreadCount
 * @returns {void}
 */
const setTabBarBadge = async function (unreadCount) {
  try {
      if (unreadCount > 0) {
          await wx.setTabBarBadge({
            // 从左往右0.1.2.3
              index: 2,
              text: unreadCount.toString()
          })
      } else {
          await wx.removeTabBarBadge({
              index: 2
          })
      }
      wx.setStorageSync('unread-count', 0)
  } catch (e) {
      wx.setStorageSync('unread-count', unreadCount)
      console.log(e)
  }
}

export {
  wxToPromise, setTabBarBadge
}
