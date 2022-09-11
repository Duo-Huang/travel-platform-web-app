<template>
    <div>
        <br />
        <br />
        <br />
        <h1>这里是订单提交页，你可以选择乘机人，联系人，保险等信息</h1>
        <br />
        <br />
        <br />
        <el-button @click="submit" size="large" type="primary">提交订单</el-button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const submit = () => {
    const { flightId, cabinId } = route.params
    console.log('create order', 'flightId: ', flightId, 'cabinId: ', cabinId)
    console.log('call create order api, and got the order id: 1234567890')

    router.push({ name: 'flightOrderDetails', params: { orderId: '1234567890' } })
}
</script>
