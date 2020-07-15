let role = require("./tree_data.js");
// 需求: 获取数组中已经被选中的id 存到一个数组中

// 1.新建空数组
var keys = []

// 2.新建一个方法(数据,空数组) 
function getLeafId(role,keys){
// 2.1 判断该节点有没有子元素 如果没有子元素 那么把该元素的id放到数组中
  if (!role.children){
    return keys.push(role.id);
  }
// 2.2 判断该节点有没有子元素 如果有子元素 继续遍历
role.children.forEach(item => getLeafId(item, keys));
}

getLeafId(role,keys);

// console.log(keys);

