import { ActionContext } from 'vuex'
import { STORE } from '@/constants'
import { flights } from '@/data-access' // 测试会mock houses上的方法，因此houses内部的方法不能解构

const { ACTIONS, MUTAIONS } = STORE

export const actions = {
    async [ACTIONS.GET_FLIGHT_DETAILS](
        { commit }: ActionContext<AppState.Flights, AppState.RootState>,
        flightId: string
    ) {
        const flightDetails = await flights.getFlightDetails(flightId)
        commit(MUTAIONS.SET_FLIGHT_DETAILS, { flightId, flightDetails })
    },
}
