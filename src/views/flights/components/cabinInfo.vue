<template>
    <div class="cabin">
        <div>
            <div class="discount">
                <div>{{ info.cabinDiscount }}</div>
                <div>
                    <span class="tag" v-for="tag in info.tagIconList">{{ tag }}</span>
                </div>
            </div>
            <div class="tips">
                <template v-for="(tip, index) in info.cabTipsList">
                    <span class="split" v-if="index !== 0">|</span>
                    <span class="tip"> {{ tip }} </span>
                </template>
            </div>
        </div>
        <div>
            <div class="price">￥{{ info.price }}</div>
            <el-button data-test="buy-ticket" type="primary" @click="buyTicket">预订</el-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { FlightListItemDetail } from '@/types/flights'

const props = defineProps<{ info: FlightListItemDetail }>()
const emit = defineEmits<{ (e: 'buyTicket', cabinId: string): void }>()

const buyTicket = () => {
    emit('buyTicket', props.info.cabinId)
}
</script>

<style lang="scss" scoped>
.cabin {
    @include row();
    border-bottom: 1px solid #ddd;
    padding: 20px 50px;

    > div {
        @include row();
    }

    .discount {
        color: #000;
        font-size: 16px;
        width: 300px;
        margin-right: 30px;

        .tag {
            display: inline-block;
            padding: 5px;
            background-color: burlywood;
            font-size: 12px;
            margin: 5px 5px 5px 0;
        }
    }

    .tips {
        > .tip {
            padding: 5px 0;
            border-bottom: 1px dashed #ccc;
        }

        > .split {
            margin: 0 5px;
            color: #ddd;
        }
    }

    .price {
        font-size: 24px;
        color: $text-money;
        font-weight: bold;
        margin-right: 20px;
    }
}
</style>
