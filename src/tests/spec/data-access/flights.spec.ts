import { getFlights, getFlightDetails } from '@/data-access/flights'
import request from '@/http'
import { flights, flightDetails } from '@/tests/fixtures/flights'

describe('Test flights module of data access', () => {
    it('getFlights', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(flights) // Stub request
        const data = await getFlights()
        expect(data).toEqual(flights.data)
    })

    it('getFlightDetails', async () => {
        vi.spyOn(request, 'get').mockResolvedValue(flightDetails) // Stub request
        const data = await getFlightDetails('1')
        expect(data).toEqual(flightDetails.data)
    })
})
