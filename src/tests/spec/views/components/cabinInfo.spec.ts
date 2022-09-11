import { shallowMount, VueWrapper } from '@vue/test-utils'
import cabinInfoVue from '@/views/flights/components/cabinInfo.vue'
import { flightDetails } from '@/tests/fixtures/flights'
import { FlightListItemDetail } from '@/types/flights'

interface LocalTestContext {
    container: VueWrapper<any>
    info: FlightListItemDetail
}

describe('Should render correct', () => {
    beforeEach<LocalTestContext>((ctx) => {
        const info = flightDetails.data[0]
        const container = shallowMount(cabinInfoVue, {
            propsData: {
                info,
            },
        })
        ctx.container = container
        ctx.info = info
    })

    it<LocalTestContext>('Should render api field correct', ({ container, info }) => {
        expect(container.find('.discount').text()).contain(info.cabinDiscount)
        expect(container.find('.tips').text()).contain(info.cabTipsList[0])
        expect(container.find('.tips').text()).contain(info.cabTipsList[1])
        expect(container.find('.price').text()).contain(info.price)
        expect(container.find('[data-test=buy-ticket]')).toBeTruthy()
    })

    it<LocalTestContext>('Should emit buyTicket event when click button', ({ container, info }) => {
        container.vm.buyTicket()
        expect(container.emitted().buyTicket[0]).toEqual([info.cabinId])
    })
})
