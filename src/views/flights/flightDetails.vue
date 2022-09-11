<template>
    <div>
        <cabinInfo
            v-if="!loadFail"
            v-for="detail in flightDetails.get(flightId) || []"
            :info="detail"
            @buyTicket="buyTicket"
        ></cabinInfo>
        <div class="error-msg" v-else>该航班的舱位信息查询失败，您可以选择其他航班</div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import cabinInfo from './components/cabinInfo.vue'
import { ACTIONS } from '@/constants/store'

const props = defineProps<{ flightId: string }>()

const router = useRouter()

const buyTicket = (cabinId: string) => {
    router.push({ name: 'flightOrderCreate', params: { flightId: props.flightId, cabinId } })
}

const loadFail = ref(false)

const load = () => {
    return store.dispatch(ACTIONS.GET_FLIGHT_DETAILS, props.flightId).catch((err) => {
        loadFail.value = true
        return Promise.reject(err)
    })
}

const store = useStore<AppState.RootState>()
const flightDetails = computed(() => store.state.flights.flightDetails)

defineExpose({
    load,
})
</script>

<style lang="scss" scoped>
.error-msg {
    font-size: 24px;
    height: 200px;
    @include row(center);
}
</style>
