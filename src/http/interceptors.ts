import { AxiosError, AxiosStatic, AxiosInstance } from 'axios'
import { HTTP } from '@/constants'
import messager from '@/utils/message'

const { HTTP_STATUS, HTTP_ERROR_CODE, HTTP_ERROR_CODE_MSG } = HTTP

export const errorProcessor = (err: AxiosError<AppHttp.Response<any>>) => {
    // const popupErrMsg = (msg: string) => {
    //     // 重试的请求不弹，只弹重试的最后一次
    //     const config = err.config as AppHttp.RequestConfig
    //     if (!config._retryCount || config._retryCount === config.retry?.retries) {
    //         // messager.error(msg)
    //     }
    // }

    // 处理客户端请求错误
    if (err.message.toLowerCase().includes('timeout')) {
        messager.error(HTTP_ERROR_CODE_MSG.TIMEOUT)
        return Promise.reject(err)
    }
    if (err.message.toLowerCase().includes('network error')) {
        messager.error(HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.ERR_NETWORK])
        return Promise.reject(err)
    }
    if (!err.response) {
        messager.error(HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.UNKNOWN])
        return Promise.reject(err)
    }

    // 处理服务端响应错误
    const {
        status,
        config,
        data: { code, message },
    } = err.response

    if (status !== HTTP_STATUS.BUSSINESS_ERROR) {
        // 处理http status error
        messager.error(HTTP_ERROR_CODE_MSG[status] || HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.UNKNOWN])
        return Promise.reject(err)
    }
    // 处理业务异常
    messager.error(HTTP_ERROR_CODE_MSG[code] || message || HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.UNKNOWN])
    return Promise.reject(err)
}

export const useError = (instance: AxiosStatic | AxiosInstance) => {
    instance.interceptors.response.use((res) => res, errorProcessor)
}

export const useRetry = (instance: AxiosStatic | AxiosInstance, options: AppHttp.RetryConfig) => {
    const DEFAULT_RETRY_CONFIG = {
        retries: 3,
        retryDelay: 0,
        retryCondition: true, // 默认重试任何error
    }

    const retry = (err: AxiosError<AppHttp.Response<any>>, config: AppHttp.RetryConfig) => {
        if (!config.retryCondition) {
            return Promise.reject(err)
        }
        const reqConfig = err.config as AppHttp.RequestConfig
        if (reqConfig._retryCount! <= config.retries!) {
            // 有等于，即retries不包含首次请求

            reqConfig._retryCount!++

            return new Promise((resolve) =>
                setTimeout(() => resolve(instance.request(reqConfig)), config.retryDelay as number)
            )
        }
        return Promise.reject(err)
    }

    instance.interceptors.response.use(
        (res) => res,
        (err: AxiosError<AppHttp.Response<any>>) => {
            if (err.message.includes('timeout')) {
                // 不重试timeout
                return Promise.reject(err)
            }

            const reqConfig = err.config as AppHttp.RequestConfig

            if (!reqConfig._retryCount) {
                reqConfig._retryCount = 1 // 不能为0
            }

            const retryOption = { ...DEFAULT_RETRY_CONFIG, ...options, ...reqConfig.retry }

            retryOption.retryDelay =
                typeof retryOption.retryDelay !== 'number'
                    ? retryOption.retryDelay(reqConfig._retryCount)
                    : retryOption.retryDelay
            retryOption.retryCondition =
                typeof retryOption.retryCondition !== 'boolean'
                    ? retryOption.retryCondition(err)
                    : retryOption.retryCondition

            return retry(err, retryOption)
        }
    )
}
