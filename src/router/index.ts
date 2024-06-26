import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import flights from '@/views/flights/flights.vue'
import flightOrderCreate from '@/views/flight-order-create/flightOrderCreate.vue'
import flightOrderDetails from '@/views/flight-order-details/flightOrderDetails.vue'
import corpPayApproval from '@/views/corp-pay-approval/corpPayApproval.vue'

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/flights',
        name: 'flights',
        component: flights,
    },
    {
        path: '/flight-order-create',
        name: 'flightOrderCreate',
        component: flightOrderCreate,
    },
    {
        path: '/flight-order-details',
        name: 'flightOrderDetails',
        component: flightOrderDetails,
    },
    {
        path: '/corp-pay-approval',
        name: 'corpPayApproval',
        component: corpPayApproval,
    },
]

const home: Readonly<RouteRecordRaw> = {
    path: '/:pathMatch(.*)*',
    redirect: '/flights',
}

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, home],
})

export default router
