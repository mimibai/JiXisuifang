/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证用户名
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if (str.length > 1) {
    return true
  } else {
    return false
  }
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
}
/**
 * 验证姓名
 * @param {string} string
 * @returns {Boolean}
 */
export function validFullName(string) {
  return /^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/.test(string)
}
/**
 * 验证密码必须包括字母、数字和特殊字符且长度在6-18位
 * @param {string} string
 * @returns {Boolean}
 */
export function validPassword(string) {
  return /^(?!([A-Z]*|[a-z]*|[0-9]*|[!-/:-@\[-`{-~]*|[A-Za-z]*|[A-Z0-9]*|[A-Z!-/:-@\[-`{-~]*|[a-z0-9]*|[a-z!-/:-@\[-`{-~]*|[0-9!-/:-@\[-`{-~]*)$)[A-Za-z0-9!-/:-@\[-`{-~]{8,16}$/.test(string)
}
/**
 * 验证手机号
 * @param {number} number
 * @returns {Boolean}
 */
export function validMobileNumber(number) {
  return /^(13[0-9]|14[56789]|15[012356789]|16[2567]|17[012345678]|18[0-9]|19[012356789])[0-9]{8}$/.test(number)
}
/**
 * 验证身份证号码
 * @param {string} str
 * @returns {Boolean}
 */
export function validIdCardNumber(str) {
  return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(str)
}
/**
 * 验证护照
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassPortCard(str) {
  return /^([a-zA-z]|[0-9]){9}$/.test(str)
}
/**
 * 验证军官证
 * @param {string} str
 * @returns {Boolean}
 */
export function validOfficerCard(str) {
  return /^[a-zA-Z0-9]{7,21}$/.test(str)
}
/**
 * 验证港澳台居民居住证
 * @param {string} str
 * @returns {Boolean}
 */
export function validHKAndMacaoAndMTPIDCard(str) {
  return /^8[123]0000(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dX]$/.test(str)
}
/**
 * 验证外国人永久居留身份证
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsRegexpIsFPerManentCard(str) {
  return /^[a-zA-Z]{3}\d{12}$/.test(str)
}
/**
 * 验证台湾居民来往大陆通行证
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsMTPsCard(str) {
  return /^([0-9]{8}|[0-9]{10})$/.test(str)
}
/**
 * 验证内地居民往来港澳通行证
 * @param {string} str
 * @returns {Boolean}
 */
export function validNDToHKAndMacaoPermitNum(str) {
  return /^C([A-Z]{1}\d{7}|\d{8})$/.test(str)
}
/**
 * 验证港澳居民来往内地通行证
 * @param {string} str
 * @returns {Boolean}
 */
export function validIsHKAndMacaoPermitCard(str) {
  return /^[HhMm]{1}([0-9]{10}|[0-9]{8})$/.test(str)
}
/**
 * 验证正数类型
 * @param {number} num
 * @returns {Boolean}
 */
export function validPositiveNumber(num) {
  return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(num)
}
/**
 * 验证浮点类型
 * @param {number} num
 * @returns {Boolean}
 */
export function validFloatNumber(num) {
  return /^(-?\d+)(\.\d+)?$/.test(num)
}
/**
 * 验证是否是是正整数
 * @param {number} num
 * @returns {Boolean}
 */
export function validNumber(num) {
  return /^0?$|^([1-9][0-9]*)?$/.test(num)
}
