// 基类
class Base{
  page=1
  count=4
  data=[]
  // hasMoreData是否有更多的数据
  hasMoreData=true

  // 将数据初始化
  reset(){
    this.page=1
    this.count=4
    this.data=[]
    this.hasMoreData=true
    return this
  }
}

export default Base