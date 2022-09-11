/**
 * 业务错误统一使用499 http status
 * 统一定义错误码[response.data.code]
错误码规范
统一在一个文件中定义错误码；
错误码长度为 5 位；
第 1 位表示错误是哪种级别？例如：1 为系统级错误，2 为业务模块错误，可标记 9 种错误级别。
第 2 位和第 3 位表示错误是哪个模块？例如：01 为用户模块，02 为订单模块，可标记 99 个模块。
第 4 位和第 5 位表示具体是什么错误？例如：01 为手机号不合法，02 为验证码输入错误，可标记 99 个错误。
 */

export const HTTP_STATUS = {
    BUSSINESS_ERROR: 499,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    BAD_GATEWAY: 502,
}

export const HTTP_ERROR_CODE = {
    // 客户端error code
    TIMEOUT: 'TIMEOUT',
    UNKNOWN: 'UNKNOWN',
    ERR_NETWORK: 'ERR_NETWORK',
}

export const HTTP_ERROR_CODE_MSG = {
    // client error msg
    [HTTP_ERROR_CODE.TIMEOUT]: '请求超时，请稍后再试',
    [HTTP_ERROR_CODE.ERR_NETWORK]: '请检查您的网络后重试',
    // fallback error msg
    [HTTP_ERROR_CODE.UNKNOWN]: '未知错误',
    [HTTP_STATUS.BUSSINESS_ERROR]: '业务异常',
    // http status error msg
    [HTTP_STATUS.BAD_REQUEST]: '错误的请求',
    [HTTP_STATUS.UNAUTHORIZED]: '未认证的用户',
    [HTTP_STATUS.FORBIDDEN]: '拒绝访问',
    [HTTP_STATUS.NOT_FOUND]: '请求找不到',
    [HTTP_STATUS.CONFLICT]: '请求冲突',
    [HTTP_STATUS.INTERNAL_ERROR]: '服务出错, 请稍后再试',
    [HTTP_STATUS.BAD_GATEWAY]: '网关错误, 请稍后再试',
    // business error code msg
    20201: '手机号不存在',
    20211: '因公支付订单未审批通过，不能支付',
}
