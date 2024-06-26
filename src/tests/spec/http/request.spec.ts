import MockAdapter from 'axios-mock-adapter'
import request, { http } from '@/http/request'
import messager from '@/utils/message'
import { HTTP_STATUS, HTTP_ERROR_CODE, HTTP_ERROR_CODE_MSG } from '@/constants/http'

const ApiStub = new MockAdapter(http)

beforeEach(() => {
    ApiStub.reset()
})

describe('Test get method of request', () => {
    it('Should get an expected response data structure when get-request suceessfully.', async () => {
        ApiStub.onGet('/get-successful-response-structure').reply(200, {
            code: 0,
            message: '',
            data: [],
        }) // stub Web BFF
        const res = await request.get('/get-successful-response-structure')
        expect(res).toHaveProperty('code')
        expect(res).toHaveProperty('message')
        expect(res).toHaveProperty('data')
        expect(typeof res.code).toBe('number')
        expect(typeof res.message).toBe('string')
    })

    it('Should get an expected response data structure when get-request failed.', async () => {
        ApiStub.onGet('/get-failed-response-structure').reply(500, {
            code: 1001,
            message: '系统错误',
            data: null,
        }) // stub Web BFF

        const res = await request.get('/get-failed-response-structure').catch((err) => {
            const { status, data } = err.response
            expect(status).toBeGreaterThan(400)
            expect(data).toHaveProperty('code')
            expect(typeof data.code).toBe('number')
            expect(data.code).toBeGreaterThan(0)
            expect(data).toHaveProperty('message')
            expect(typeof data.message).toBe('string')
            expect(data.message).not.toBe('')
            expect(data).toHaveProperty('data')
        })

        expect(res).toBe(undefined)
    })
})

describe('Test post method of request', () => {
    it('Should get an expected response data structure when post-request suceessfully.', async () => {
        ApiStub.onPost('/post-successful-response-structure').reply(200, {
            code: 0,
            message: '',
            data: [],
        }) // stub Web BFF
        const res = await request.post('/post-successful-response-structure')
        expect(res).toHaveProperty('code')
        expect(res).toHaveProperty('message')
        expect(res).toHaveProperty('data')
        expect(typeof res.code).toBe('number')
        expect(typeof res.message).toBe('string')
    })

    it('Should get an expected response data structure when post-request failed.', async () => {
        ApiStub.onPost('/post-failed-response-structure').reply(500, {
            code: 10011,
            message: '系统内部错误',
            data: null,
        }) // stub Web BFF

        const res = await request.post('/post-failed-response-structure').catch((err) => {
            const { status, data } = err.response
            expect(status).toBeGreaterThan(400)
            expect(data).toHaveProperty('code')
            expect(typeof data.code).toBe('number')
            expect(data.code).toBeGreaterThan(0)
            expect(data).toHaveProperty('message')
            expect(typeof data.message).toBe('string')
            expect(data.message).not.toBe('')
            expect(data).toHaveProperty('data')
        })

        expect(res).toBe(undefined)
    })
})

describe('Test error processing for request', () => {
    it('Should pop up err message when server response error', async () => {
        ApiStub.onGet('/test-response-error').reply(500, {
            code: 10012,
            message: '系统内部错误',
            data: null,
        }) // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-response-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith(HTTP_ERROR_CODE_MSG[HTTP_STATUS.INTERNAL_ERROR])
    })

    it('Should pop up err message when network error', async () => {
        ApiStub.onGet('/test-network-error').networkError() // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-network-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith(HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.ERR_NETWORK])
    })

    it('Should pop up err message when timeout error', async () => {
        ApiStub.onGet('/test-timeout-error').timeout() // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-timeout-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith(HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.TIMEOUT])
    })

    it('Should pop up err message when business error and existed error code mapper in frontend', async () => {
        ApiStub.onGet('/test-business-error').reply(499, {
            code: 20211,
            message: '',
            data: null,
        }) // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-business-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith(HTTP_ERROR_CODE_MSG[20211])
    })

    it('Should pop up err message when business error and no error code mapper in frontend', async () => {
        ApiStub.onGet('/test-business-error').reply(499, {
            code: 20223,
            message: '手机号错误',
            data: null,
        }) // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-business-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith('手机号错误')
    })

    it('Should pop up err message when business error and no error code mapper in frontend and no message in response', async () => {
        ApiStub.onGet('/test-business-error').reply(499, {
            code: 10223,
            message: '',
            data: null,
        }) // stub Web BFF
        const popup = vi.spyOn(messager, 'error') // spy element-puls 的message实例
        await request.get('/test-business-error').catch(() => {})
        expect(popup).toHaveBeenCalledWith(HTTP_ERROR_CODE_MSG[HTTP_ERROR_CODE.UNKNOWN])
    })
})

describe('Test request retry', () => {
    it('should not be retried in the default configuration when request failed', async () => {
        ApiStub.onGet('/test-failed-response-default-retry').reply(500, {
            code: 10014,
            message: '系统内部错误',
            data: null,
        }) // stub Web BFF
        const requestSpy = vi.spyOn(http, 'request') // spy http.request

        await request.get('/test-failed-response-spec-retry').catch(() => {})
        expect(requestSpy).toBeCalledTimes(1) // 1是原始请求
    })

    it('should not be retried when request timeout', async () => {
        ApiStub.onGet('/test-timeout-response-retry').timeout() // stub Web BFF
        const requestSpy = vi.spyOn(http, 'request') // spy http.request

        await request
            .get(
                '/test-timeout-response-retry',
                {},
                {
                    retry: {
                        retries: 3,
                        retryCondition: true,
                    },
                }
            )
            .catch(() => {})
        expect(requestSpy).toBeCalledTimes(1)
    })

    it('Should be retried in the spec configuration when responese failed', async () => {
        ApiStub.onGet('/test-failed-response-spec-retry').reply(500, {
            code: 10017,
            message: '系统内部错误',
            data: null,
        }) // stub Web BFF
        const requestSpy = vi.spyOn(http, 'request') // spy http.request
        await request
            .get(
                '/test-failed-response-spec-retry',
                {},
                {
                    retry: {
                        retries: 3,
                        retryDelay: 0,
                        retryCondition: true,
                    },
                }
            )
            .catch(() => {})
        expect(requestSpy).toBeCalledTimes(4) // 4包含原始请求
    })

    it('Should be retried in the spec configuration when network error', async () => {
        ApiStub.onGet('/test-failed-response-spec-retry').networkError() // stub Web BFF
        const requestSpy = vi.spyOn(http, 'request') // spy http.request
        await request
            .get(
                '/test-failed-response-spec-retry',
                {},
                {
                    retry: {
                        retries: 3,
                        retryDelay: 0,
                        retryCondition: true,
                    },
                }
            )
            .catch(() => {})
        expect(requestSpy).toBeCalledTimes(4) // 4包含原始请求
    })

    it('Should reject once after failed request retry', async () => {
        ApiStub.onGet('/test-failed-retry-reject-once').reply(500, {
            code: 10012,
            message: '系统内部错误',
            data: null,
        }) // stub Web BFF
        const requestCatchSpy = vi.fn() // spy catch callback of request
        await request
            .get(
                '/test-failed-retry-reject-once',
                {},
                {
                    retry: {
                        retries: 3,
                        retryDelay: 0,
                        retryCondition: true,
                    },
                }
            )
            .catch(requestCatchSpy)
        // 确保retry多次后只reject一次，防止业务代码catch被多次调用，
        // 可以确保重试期间promise一直保持pending状态，从而调用方不感知重试
        expect(requestCatchSpy).toBeCalledTimes(1)
    })
})
