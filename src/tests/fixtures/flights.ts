import { FlightListItem, FlightListItemDetail } from '@/types/flights'

export const flights: AppHttp.Response<FlightListItem[]> = {
    code: 0,
    message: '',
    data: [
        {
            pID: '63efb6a8c7e94f068dbc7b16786d0a7f-EU2235',
            airlineInfo: {
                name: '成都航空有限公司',
                logo: 'https://pic.c-ctrip.com/AssetCatalog/airline/32/EU.png',
                flightNo: 'EU2235',
                craftDetail: {
                    name: '空中客车 A320(中)',
                    seatMax: 180.0,
                    seatMin: 123.0,
                },
            },
            fCityName: '成都',
            fPortName: '双流国际机场',
            fPortShortName: '双流',
            fTerminal: 'T2',
            fDate: '2022-09-10',
            fTime: '07:15',
            tCityName: '广州',
            tPortName: '白云国际机场',
            tPortShortName: '白云',
            tTerminal: 'T1',
            tDate: '2022-09-10',
            tTime: '09:40',
            durationInfo: '2小时25分钟',
            onTime: '准点率 100%',
            price: 320.0,
        },
        {
            pID: '63efb6a8c7e94f068d123416786d0a7f-EU2235',
            airlineInfo: {
                name: '中国国际航空股份有限公司',
                logo: 'https://pic.c-ctrip.com/AssetCatalog/airline/32/CA.png',
                flightNo: 'CA4305',
                craftDetail: {
                    name: '空中客车 A330-200(大)',
                    seatMax: 412.0,
                    seatMin: 257.0,
                },
            },
            fCityName: '成都',
            fPortName: '双流国际机场',
            fPortShortName: '双流',
            fTerminal: 'T2',
            fDate: '2022-09-10',
            fTime: '08:00',
            tCityName: '广州',
            tPortName: '白云国际机场',
            tPortShortName: '白云',
            tTerminal: 'T1',
            tDate: '2022-09-10',
            tTime: '10:30',
            durationInfo: '2小时30分钟',
            onTime: '准点率 100%',
            price: 370.0,
        },
    ],
}

export const flightDetails: AppHttp.Response<FlightListItemDetail[]> = {
    code: 0,
    message: '',
    data: [
        {
            cabinId: '123-456',
            price: 910,
            tagIconList: ['赠150元接送机券', '首次改期免费', '商务推荐'],
            cabTipsList: ['提前改期免费', '免费托运20kg'],
            cabin: '经济舱',
            cabinDiscount: '经济舱5.6折',
        },
        {
            cabinId: '432-456',
            price: 320,
            tagIconList: ['商旅自营', '商务推荐'],
            cabTipsList: ['退改¥96起', '免费托运20kg'],
            cabin: '经济舱',
            cabinDiscount: '经济舱1.6折',
        },
    ],
}
