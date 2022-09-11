import request from '@/http'
import { CorpPayApprover, CorpPayProject } from '@/types/clientManagement'
import repository from '@/utils/repository'

export const getCorpPayApprovers = () =>
    request.get<CorpPayApprover[]>(`/corporate-payment/approvers`).then((res) => res.data)

export const getCorpPayProjects = () => {
    const apOn = repository.get('apOn') // DEBUG
    return request
        .get<CorpPayProject[]>(
            `/corporate-payment/projects`,
            { apOn },
            {
                ignoreGlobalErrorMsg: true,
                retry: {
                    retries: 3,
                    retryDelay: (retryCount) => retryCount * 100,
                    retryCondition: true,
                },
            }
        )
        .then((res) => {
            repository.set('corpPayProjects', res.data, true, 30 * 24 * 60 * 60)
            return res.data
        })
        .catch(() => {
            // 请求失败读缓存，将缓存数据reject出去。
            const cachedCorpPayProjects = repository.get<CorpPayProject[]>('corpPayProjects')
            if (cachedCorpPayProjects) {
                return Promise.reject(cachedCorpPayProjects)
            }
            return Promise.reject([])
        })
}
