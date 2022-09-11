import { getFlightOrderDetails } from '@/data-access/orders'
import request from '@/http'
import { flightOrderDetails } from '@/tests/fixtures/orders'

describe('Test orders module of data access', () => {
    it('getFlightOrderDetails', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(flightOrderDetails) // Stub request
        const data = await getFlightOrderDetails('1')
        expect(data).toEqual(flightOrderDetails.data)
    })
})
