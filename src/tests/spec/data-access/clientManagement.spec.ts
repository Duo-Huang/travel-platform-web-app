import { getCorpPayApprovers, getCorpPayProjects } from '@/data-access/clientManagement'
import request from '@/http'
import { corpPayApprovers, corpPayProjects } from '@/tests/fixtures/clientManagement'
import repositry from '@/utils/repository'

describe('Test client management module of data access', () => {
    it('getCorpPayApprovers', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(corpPayApprovers) // Stub request
        const data = await getCorpPayApprovers()
        expect(data).toEqual(corpPayApprovers.data)
    })

    it('getCorpPayProjects', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(corpPayProjects) // Stub request
        const data = await getCorpPayProjects()
        expect(data).toEqual(corpPayProjects.data)
    })

    it('getCorpPayProjects - Should store data when requested successfully', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(corpPayProjects) // Stub request
        const repositrySpy = vi.spyOn(repositry, 'set') // spy repositry
        const data = await getCorpPayProjects()
        expect(repositrySpy).toHaveBeenCalledWith('corpPayProjects', data, true, 30 * 24 * 60 * 60)
    })
})
