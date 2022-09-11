import { Mutation } from 'vuex'
import { STORE } from '@/constants'

const { MUTAIONS } = STORE

export const mutations = {
    [MUTAIONS.SET_FLIGHT_DETAILS]: ((state, payload) => {
        state.flightDetails.set(payload.flightId, payload.flightDetails)
    }) as Mutation<AppState.Flights>,
}
