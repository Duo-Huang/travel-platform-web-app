import { ElMessage, MessageParams } from 'element-plus'
import 'element-plus/es/components/message/style/css' // 只使用组件Api，自动导入插件不会引入样式

class Messager {
    private readonly config: MessageParams = {
        showClose: true,
        duration: 3000,
    }

    public error(message: string, options?: MessageParams) {
        ElMessage({
            ...(this.config as object),
            type: 'error',
            message,
            ...(options as object),
        } as MessageParams)
    }

    public success(message: string, options?: MessageParams) {
        ElMessage({
            ...(this.config as object),
            type: 'success',
            message,
            ...(options as object),
        } as MessageParams)
    }

    public warning(message: string, options?: MessageParams) {
        ElMessage({
            ...(this.config as object),
            type: 'warning',
            message,
            ...(options as object),
        } as MessageParams)
    }

    public info(message: string, options?: MessageParams) {
        ElMessage({
            ...(this.config as object),
            type: 'info',
            message,
            ...(options as object),
        } as MessageParams)
    }
}

const messager = new Messager()

export default messager
