import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

declare global {
    namespace AppHttp {
        interface Response<T> {
            code: number
            message: string
            data: T
        }

        interface RetryConfig {
            retries?: number
            retryDelay?: number | ((_retryCount: number) => number)
            retryCondition?: boolean | ((err: AxiosError<AppHttp.Response<any>>) => boolean)
        }

        interface RequestConfig extends AxiosRequestConfig {
            _retryCount?: number // 私有属性，retry计数
            ignoreGlobalErrorMsg?: boolean
            retry?: RetryConfig
        }
    }
}
