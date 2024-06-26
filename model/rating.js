import Base from "./base"
import Http from "../utils/http"

class Rating extends Base {
  async getServiceRatingList(serviceId) {
    if (!this.hasMoreData) {
      return this.data
    }
    const ratingList = await Http.request({
      url: '/v1/rating/service',
      data: {
        page: this.page,
        count: this.count,
        service_id: serviceId
      }
    })
    this.data = this.data.concat(ratingList.data)
    this.hasMoreData = !(this.page === ratingList.last_page)
    this.page++
    return this.data
  }

  static async createRating(order_id, score, content, illustration = []) {
    return Http.request({
      url: 'v1/rating',
      data: {
        order_id,
        score,
        content,
        illustration
      },
      method: 'POST'
    })
  }

  static getRatingByOrderId(orderId) {
    return Http.request({
      url: `v1/rating/order`,
      data: {
        order_id: orderId
      },
      method: 'get'
    })
  }

  async getMyRatingByServiceId(id) {
    return await Http.request({
      url: 'v1/rating/my',
      data: {
        service_id: id,
      }
    })
  }
}

export default Rating