import { s } from 'vitest/dist/index-4a906fa4'

export interface FlightListItem {
    pID: string
    airlineInfo: {
        name: string
        logo: string
        flightNo: string
        craftDetail: {
            name: string
            seatMax: number
            seatMin: number
        }
    }
    fCityName: string
    fPortName: string
    fPortShortName: string
    fTerminal: string
    fDate: string
    fTime: string
    tCityName: stirng
    tPortName: string
    tPortShortName: string
    tTerminal: string
    tDate: string
    tTime: string
    durationInfo: string
    onTime: string
    price: number
}

export interface FlightListItemDetail {
    cabinId: string
    price: number
    tagIconList: string[]
    cabTipsList: string[]
    cabin: string
    cabinDiscount: string
}
