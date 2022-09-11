<template>
    <div>
        <div>
            <br />
            <br />
            <br />
            <h1>这里是订单详情页，你可以选择因公、私支付方式</h1>
            <br />
            <br />
            <br />
            <el-button @click="corpPay" size="large" type="primary">因公支付</el-button>
            <el-button @click="personalPay" size="large" type="primary">因私支付</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const corpPay = () => {
    console.log(route.params.orderId)
    router.push({ name: 'corpPayApproval', params: { orderId: route.params.orderId } })
}

const personalPay = () => {}
</script>
