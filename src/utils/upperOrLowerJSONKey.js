//对象转换大小写
// 首字母大写转换
export function upperJSONKey(jsonObj) {
  for (var key in jsonObj) {
    jsonObj[key.substring(0, 1).toUpperCase() + key.substring(1)] = jsonObj[key];
    delete(jsonObj[key]);
  }
  return jsonObj;
}
// 首字母小写转换
export function lowerJSONKey(jsonObj) {
  for (var key in jsonObj) {
    jsonObj[key.substring(0, 1).toLowerCase() + key.substring(1)] = jsonObj[key];
    delete(jsonObj[key]);
  }
  return jsonObj;
}
