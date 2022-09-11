<template>
    <div class="flights">
        <h1>航班查询</h1>
        <el-button @click="switchCp">切换分区CP场景</el-button>
        <p style="color: chocolate">
            注：👆🏻查询航班详情信息将模拟500，如需模拟断网请自行控制台操作关闭network，结合控制台观察页面一致性的变化，如重试，提示，隐藏后续入口等
        </p>
        <div class="search">搜索区域</div>
        <div class="list" v-loading="lodingList">
            <div class="item" v-for="({ airlineInfo, ...others }, index) in flights">
                <div class="overview">
                    <div>
                        <img :src="airlineInfo.logo" alt="" />
                        <div class="airline">
                            <div>{{ airlineInfo.name }}</div>
                            <div>{{ airlineInfo.flightNo }}|{{ airlineInfo.craftDetail.name }}</div>
                        </div>
                    </div>
                    <div class="from-to">
                        <div>
                            <div class="time">{{ others.fTime }}</div>
                            <div>{{ others.fPortShortName }} {{ others.fTerminal }}</div>
                        </div>
                        <div>
                            <span class="line"></span>
                        </div>
                        <div>
                            <div class="time">{{ others.tTime }}</div>
                            <div>{{ others.tPortShortName }} {{ others.tTerminal }}</div>
                        </div>
                    </div>
                    <div class="on-time">{{ others.onTime }}</div>
                    <div>
                        <span class="price">￥{{ others.price }}</span>
                        <div
                            :class="['view-ticket', { active: others.showDetails }]"
                            @click="viewFlightDetail(others.pID, index)"
                        >
                            <el-icon class="is-loading" v-if="others.loading"><i-ep-loading /></el-icon>
                            <template v-else>
                                <span>订票</span>
                                <el-icon class="icon"><i-ep-ArrowDownBold /></el-icon>
                            </template>
                        </div>
                    </div>
                </div>
                <flightDetailsCom ref="childs" v-show="others.showDetails" :flightId="others.pID"></flightDetailsCom>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { getFlights } from '@/data-access/flights'
import { FlightListItem } from '@/types/flights'
import repository from '@/utils/repository' // DEBUG CP
import flightDetailsCom from './flightDetails.vue'
import messager from '@/utils/message'

interface Flights extends FlightListItem {
    showDetails: boolean
    loading: boolean
}

const flights = ref<Flights[]>([])
const lodingList = ref(true)
const store = useStore<AppState.RootState>()

repository.remove('cpOn') // DEBUG CP

onMounted(async () => {
    const data = await getFlights().finally(() => (lodingList.value = false))
    flights.value = data.map((x) => ({ ...x, showDetails: false, loading: false }))
})

const flightDetails = computed(() => store.state.flights.flightDetails)

const childs = ref<Array<InstanceType<typeof flightDetailsCom>> | null[]>([null])

const switchCp = () => {
    // DEBUG CP
    repository.set('cpOn', true)
    messager.warning('CP场景已开启，可刷新后关闭')
}

const viewFlightDetail = async (id: string, index: number) => {
    const flight = flights.value.find((x) => x.pID === id)
    if (flight!.loading) {
        return
    }
    if (flight!.showDetails) {
        flight!.showDetails = !flight!.showDetails
        return
    }
    if (!flightDetails.value.has(id)) {
        flight!.loading = true
        // await store.dispatch(ACTIONS.GET_FLIGHT_DETAILS, id).finally(() => (flight!.loading = false))
        await childs.value[index]
            ?.load()
            .catch(() => {})
            .finally(() => (flight!.loading = false))
    }
    flight!.showDetails = !flight!.showDetails
}
</script>

<style lang="scss" scoped>
.flights {
    width: 1200px;
    margin: auto;

    .search {
        height: 200px;
        margin: 50px 0;
        font-size: 24px;
        text-align: center;
        background-color: #e6e6e6;
    }

    .list {
        min-height: 100px;
        font-size: 14px;

        .item {
            margin-bottom: 20px;

            .overview {
                height: 100px;
                padding: 20px;
                background-color: #fff;

                box-shadow: 0px 5px 20px 0px #ddd;

                @include row();

                > div {
                    @include row();
                }

                .airline {
                    margin-left: 10px;
                    width: 200px;
                    overflow: hidden;

                    > div {
                        width: max-content;

                        &:last-child {
                            border-bottom: 1px dotted #868db3;
                            color: $text-secondary;
                            margin-top: 5px;
                            max-width: 100%;
                            @include text-overflow();
                        }
                    }
                }

                > .from-to {
                    width: 280px;
                    overflow: hidden;
                    .time {
                        font-size: 24px;

                        & + div {
                            color: $text-secondary;
                            margin-top: 5px;
                        }
                    }

                    .line {
                        color: #cfd2e6;
                        width: 120px;
                        display: inline-block;
                        border-bottom: 5px solid #cfd2e6;
                        position: relative;
                        margin: 0 20px;

                        &::after {
                            content: '';
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            border-bottom: 5px solid #cfd2e6;
                            position: absolute;
                            right: -11px;
                            bottom: -2px;
                            transform: rotate(45deg);
                        }
                    }
                }

                .price {
                    color: #0b52d1;
                    font-size: 24px;
                    font-weight: bold;
                }

                .view-ticket {
                    margin-left: 20px;
                    display: inline-block;
                    width: 80px;
                    height: 30px;
                    padding: 5px 10px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    background-color: #0b52d1;
                    color: #fff;
                    font-weight: bold;

                    .icon {
                        margin-left: 5px;
                    }

                    &.active {
                        background-color: #fff;
                        border: 1px solid #d1d1d1;
                        color: #0b52d1;

                        > .icon {
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
    }
}
</style>
