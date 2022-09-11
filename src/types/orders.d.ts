import { CorpPayApprover, CorpPayProject } from './clientManagement'

export interface FlightOrderDetails {
    id: string
    status: 'active' | 'paid' | 'canceled'
    passenger: {
        name: string
        phone: string
    }
    flight: {
        fCityName: string
        fPortName: string
        fTerminal: string
        fDate: string
        fTime: string

        tCityName: string
        tPortName: string
        tTerminal: string
        tDate: string
        tTime: string
        durationInfo: string
        onTime: string
        price: number
    }
    fee: {
        price: number
        airportBuding: number
        fuelSurcharge: number
        service: number
        total: number
    }
}

export interface CorpPayApprovalInfo {
    approver: CorpPayApprover
    project: CorpPayProject
}
