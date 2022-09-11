<template>
    <div class="corp-pay-approval">
        <h1>因公支付审批</h1>
        <!--  -->
        <el-button @click="switchAp">{{ apOn ? '关闭' : '开启' }}分区AP场景</el-button>
        <el-button @click="switchOrderDue">{{ orderDueOn ? '关闭' : '开启' }}业务异常场景-订单过期</el-button>
        <p style="color: chocolate">
            注：👆🏻查询项目列表将模拟500，如需模拟断网请自行控制台操作关闭network，结合控制台观察页面一致性的变化，如重试，交互降级等，可无感知继续提交测试可用性
        </p>
        <!--  -->

        <el-dialog v-model="dialogVisible" width="30%" :show-close="false">
            <span>该订单由于超过30分钟未支付，已经自动取消，您可以重新下单后尽快支付</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="
                            () => {
                                dialogVisible = false
                                switchOrderDue()
                            }
                        "
                        >关闭订单过期场景</el-button
                    >
                    <el-button type="primary" @click="orderStatusConfirm">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <div>
            <div>航班信息</div>
            <div>成都 - 广州</div>
        </div>
        <div>
            <div>乘机人</div>
            <div>小明</div>
            <br />
            <br />
            <br />
        </div>
        <div class="form">
            <el-form ref="formRef" label-position="top" label-width="100px" :model="formModel" :rules="formRules">
                <el-form-item label="审批人" prop="approver">
                    <el-select v-model="formModel.approver" placeholder="请选择审批人" style="width: 100%">
                        <el-option v-for="{ name, email } in approvers" :key="name" :label="name" :value="name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称" prop="project">
                    <el-input
                        v-if="interactionFallbck.l2"
                        v-model="formModel.project"
                        placeholder="请输入项目名称"
                    ></el-input>
                    <el-select
                        v-else
                        :allow-create="interactionFallbck.l1"
                        filterable
                        v-model="formModel.project"
                        placeholder="请选择项目名称"
                        style="width: 100%"
                    >
                        <el-option v-for="{ code, name } in projects" :key="code" :label="name" :value="name" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" :loading="submitLoading" @click="submit(formRef)"
                        >提交</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormInstance, FormRules, ElLoading } from 'element-plus'
import { CorpPayApprovalInfo, FlightOrderDetails } from '@/types/orders'
import { clientManagement, orders } from '@/data-access'
import { CorpPayApprover, CorpPayProject } from '@/types/clientManagement'
import repository from '@/utils/repository' // DEBUG AP
import messager from '@/utils/message'

const { getFlightOrderDetails, submitCorpPayApproval } = orders
const { getCorpPayApprovers, getCorpPayProjects } = clientManagement
const route = useRoute()
const router = useRouter()

const approvers = ref<CorpPayApprover[]>([])
const projects = ref<CorpPayProject[]>([])
const orderDetails = ref<FlightOrderDetails>()
const orderId: string = (route.params.orderId as string) || '1'
const dialogVisible = ref(false)

const interactionFallbck = ref({
    l1: false,
    l2: false,
})

const orderStatusConfirm = () => {
    router.push({ name: 'flightOrderDetails' })
}

// 交互降级
const projectsFallback = (cachedProjects: CorpPayProject[]) => {
    if (cachedProjects.length > 0) {
        interactionFallbck.value = {
            l1: true,
            l2: false,
        }
        projects.value = cachedProjects
    } else {
        interactionFallbck.value = {
            l1: false,
            l2: true,
        }
        projects.value = []
    }
}

onMounted(() => {
    const loadingInstance = ElLoading.service({ fullscreen: true, lock: true, background: 'rgba(0, 0, 0, .3)' })
    getFlightOrderDetails(orderId)
        .then(async (data) => {
            orderDetails.value = data
            const [data1, data2] = await Promise.all([
                getCorpPayApprovers(),
                getCorpPayProjects().catch(projectsFallback),
            ])
            approvers.value = data1
            // projects可能被已被赋值为cache
            projects.value = projects.value.length > 0 ? projects.value : data2 || []
            loadingInstance.close()
        })
        .catch((err) => {
            loadingInstance.close()
            dialogVisible.value = true
        })
})

type FormModel = Record<keyof CorpPayApprovalInfo, string>

let formModel = ref<FormModel>({
    approver: '',
    project: '',
})

const formRules = reactive<FormRules>({
    approver: [{ required: true, message: '请输入审批人' }],
    project: [{ required: true, message: '请输入项目名称' }],
})

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const submit = async (formInstance: FormInstance | undefined) => {
    if (formInstance) {
        await formInstance.validate()
        submitLoading.value = true
        const data: CorpPayApprovalInfo = {
            project: projects.value.find((x) => formModel.value.project === x.name) || {
                code: '',
                name: formModel.value.project,
            },
            approver: approvers.value.find((x) => formModel.value.approver === x.name)!,
        }
        await submitCorpPayApproval(orderId, data).finally(() => (submitLoading.value = false))
        formInstance.resetFields()
        messager.success('提交成功')
    }
}


// DEBUG Code
const apOn = ref<boolean>(!!repository.get('apOn') || false)
const orderDueOn = ref<boolean>(!!repository.get('orderDue') || false)
messager.warning(`AP场景已${apOn.value ? '开启' : '关闭'}`, { duration: 5000 })
messager.warning(`业务异常场景-订单过期已${orderDueOn.value ? '开启' : '关闭'}`, { duration: 5000 })

const switchAp = () => {
    // DEBUG AP
    apOn.value = !apOn.value
    repository.set('apOn', apOn.value, true)
    messager.warning(`AP场景已${apOn.value ? '开启' : '关闭'}`)
}

const switchOrderDue = () => {
    // DEBUG OrderDue
    orderDueOn.value = !orderDueOn.value
    repository.set('orderDue', orderDueOn.value, true)
    messager.warning(`业务异常场景-订单过期已${orderDueOn.value ? '开启' : '关闭'}`)
}
</script>
