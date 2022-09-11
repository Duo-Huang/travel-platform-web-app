import { mutations } from '@/store/flights'
import { flightDetails } from '@/tests/fixtures/flights'
import { STORE } from '@/constants'

const { MUTAIONS } = STORE

describe('Test mutations of flights module', () => {
    it(MUTAIONS.SET_FLIGHT_DETAILS, () => {
        const state: AppState.Flights = { flightDetails: new Map() } // Stub state
        mutations[MUTAIONS.SET_FLIGHT_DETAILS](state, { flightId: '1', flightDetails: flightDetails.data })
        expect(state.flightDetails.get('1')).toEqual(flightDetails.data)
    })
})
