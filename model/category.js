import Http from "../utils/http"
class Category{
  static async getCategoryList(){
    const CategoryList=await Http.request({url:'/v1/category'})
    // console.log("CategoryList.data",CategoryList.data)
    return CategoryList
  }
  
  // 给接受到的数组再加一个"全部"上去
  static async getCategoryListWithList(){
    const categoryList=await Category.getCategoryList()
    categoryList.unshift({"id":0,"name":"全部"})
    return categoryList
  }
}
export default Category