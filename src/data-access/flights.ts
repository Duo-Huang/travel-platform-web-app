import request from '@/http'
import { FlightListItem, FlightListItemDetail } from '@/types/flights'
import repository from '@/utils/repository'

export const getFlights = () => request.get<FlightListItem[]>('/flights').then((res) => res.data)

export const getFlightDetails = (id: string) => {
    const cpOn = repository.get('cpOn') // DEBUG CP

    return request
        .get<FlightListItemDetail[]>(
            `/flights/${id}`,
            { cpOn },
            {
                retry: {
                    retries: 3,
                    retryDelay: (retryCount) => retryCount * 100,
                    retryCondition: true,
                },
            }
        )
        .then((res) => res.data)
}
