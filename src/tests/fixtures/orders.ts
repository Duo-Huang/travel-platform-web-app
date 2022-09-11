import { FlightOrderDetails } from '@/types/orders'

export const flightOrderDetails: AppHttp.Response<FlightOrderDetails> = {
    code: 0,
    message: '',
    data: {
        id: '72f7933c-96a0-420c-ad66-cd4fd09ccbc7',
        status: 'active', // ['active', 'paid', 'canceled']
        passenger: {
            name: '王德发',
            phone: '12345678910',
        },
        flight: {
            fCityName: '成都',
            fPortName: '双流国际机场',
            fTerminal: 'T2',
            fDate: '2022-09-10',
            fTime: '07:15',

            tCityName: '广州',
            tPortName: '白云国际机场',
            tTerminal: 'T1',
            tDate: '2022-09-10',
            tTime: '09:40',
            durationInfo: '2小时25分钟',
            onTime: '准点率 100%',
            price: 320.0,
        },
        fee: {
            price: 320,
            airportBuding: 50,
            fuelSurcharge: 120,
            service: 20,
            total: 510,
        },
    },
}
