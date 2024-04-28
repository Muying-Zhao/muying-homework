/**
 * @Author:炑焸
 * @Desc:
 */
import Http from "../utils/http"
import Base from "./base"
// 利用继承,baes相当于父类，service为子类，子类能用到父类的东西
//将自定义属性放入Base基类中，然后调用base
// 此时class Service改为class Service extends Base
class Service extends Base {
  /**
   * 分页获取服务列表
   * @param page 页码
   * @param count 每页数量
   * @param category_id 分类 id
   * @param type 服务类型
   */

  // category_id: null = null会报错，修改为category_id= null
  async getServiceList(category_id = null, type = null) {
    console.log(this.data,this.hasMoreData,this.page++)
    console.log(category_id,type)
    if (!this.hasMoreData) {
      return this.data
    }
    // console.log('获取服务列表')
    // 发起网络请求，获取数据
    // 经历避免提供犯错的机会
    // 统一的响应、异常处理
    // wx.request({
    //   url: 'url',
    // })
    // /api/versice/list
    const serviceList = await Http.request({
      url: '/v1/service/list', 
      data: {
        page: this.page,
        count: this.count,
        category_id: category_id || '',
        type: type || ''
      }
    })

    // res.then(res1=>{
    //   console.log(res1,'666')
    console.log(this.data)
    this.data = this.data.concat(serviceList.data)
    console.log(this.data)
    this.hasMoreData = !(this.page === serviceList.last_page)
    this.page++
    return this.data
  }

  static getServiceById(serviceId) {
    return Http.request({
      url: `v1/service/${serviceId}`
    })
  }

  static updateServiceStatus(serviceId, action) {
    return Http.request({
      url: `v1/service/${serviceId}`,
      data: {
        action
      },
      method: 'POST'
    })
  }

  static publishService(formData) {
    return Http.request({
      url: '/v1/service',
      data: formData,
      method: 'POST'
    })
  }

  static editService(serviceId, formData) {
    return Http.request({
      utl: `v1/service/${serviceId}`,
      data: formData,
      method: 'PUT'
    })
  }




  // my
  static async getServiceStatus(type) {
    return Http.request({
      url: `v1/service/count?type=${type}`,
    });
  }

  async getMyServiceList(type, status) {
    if (!this.hasMoreData) {
      return this.data
    }
    const serviceList = await Http.request({
      url: 'v1/service/my',
      data: {
        page: this.page,
        count: this.count,
        type,
        status
      }
    });

    this.data = this.data.concat(serviceList.data)
    this.hasMoreData = !(this.page === serviceList.last_page)
    this.page++
    return this.data
  }

}
export default Service