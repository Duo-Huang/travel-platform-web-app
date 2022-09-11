import { CorpPayApprover, CorpPayProject } from '@/types/clientManagement'

export const corpPayApprovers: AppHttp.Response<CorpPayApprover[]> = {
    code: 0,
    message: '',
    data: [
        {
            name: '小明',
            email: 'xiaoming@cd.com',
        },
        {
            name: '小芳',
            email: 'xiaofang@cd.com',
        },
        {
            name: '小李',
            email: 'xiao李@cd.com',
        },
    ],
}

export const corpPayProjects: AppHttp.Response<CorpPayProject[]> = {
    code: 0,
    message: '',
    data: [
        {
            code: 'Project-A',
            name: '任你行差旅服务平台',
        },
        {
            code: 'Project-B',
            name: '思沃租房App',
        },
        {
            code: 'Project-C',
            name: '思沃学院Web',
        },
    ],
}
