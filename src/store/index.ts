import { createStore } from 'vuex'
import * as flightsModule from './flights'

const store = createStore<AppState.RootState>({
    modules: {
        flights: {
            ...flightsModule,
        },
    },
})

export default store
