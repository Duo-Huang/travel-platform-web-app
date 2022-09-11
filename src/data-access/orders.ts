import request from '@/http'
import { FlightOrderDetails, CorpPayApprovalInfo } from '@/types/orders'
import repository from '@/utils/repository'

export const getFlightOrderDetails = (orderId: string) => {
    const orderDue = repository.get('orderDue') // DEBUG
    return request
        .get<FlightOrderDetails>(`/flights-orders/${orderId}`, { orderDue }, { ignoreGlobalErrorMsg: true })
        .then((res) => res.data)
}

export const submitCorpPayApproval = (orderId: string, corpPayApprovalInfo: CorpPayApprovalInfo) =>
    request.post(`/flights-orders/${orderId}/coporate-payment-approval`, corpPayApprovalInfo)
