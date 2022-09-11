import { flights } from '@/data-access'
import { STORE } from '@/constants'
import { flightDetails } from '@/tests/fixtures/flights'
import { createActionContext } from '@/tests/utils'
import { actions } from '@/store/flights'

const { ACTIONS, MUTAIONS } = STORE

const commitSpy = vi.fn()

describe('Test actions of flights module', () => {
    const injectee = createActionContext<AppState.Flights, AppState.RootState>({
        commit: commitSpy,
    }) // spy mutations

    it('getFlightDetails', async () => {
        vi.spyOn(flights, 'getFlightDetails').mockResolvedValue(flightDetails.data) // Stub data accsess

        await actions[ACTIONS.GET_FLIGHT_DETAILS](injectee, '1')

        expect(commitSpy).toHaveBeenCalledWith(MUTAIONS.SET_FLIGHT_DETAILS, {
            flightId: '1',
            flightDetails: flightDetails.data,
        })
    })
})
