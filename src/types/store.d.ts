import { FlightListItem, FlightListItemDetail } from './flights'

declare global {
    namespace AppState {
        interface Flights {
            flightDetails: Map<string, FlightListItemDetail[]>
        }

        interface RootState {
            flights: Flights
        }
    }
}
