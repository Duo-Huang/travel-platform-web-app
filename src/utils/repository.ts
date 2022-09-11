import CryptoJS from 'crypto-js'

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a')

export interface RepositoryConfig {
    type: 'sessionStorage' | 'localStorage'
    namespace: string
    expire: number // 0 表示永久
    isEncrypt: boolean
}

export interface RepositoryValue<T> {
    value: T
    time: number
    expire: number // 0 表示永久
}

class Repository {
    public static config: RepositoryConfig = {
        type: 'localStorage',
        namespace: 'App',
        expire: 30 * 24 * 60 * 60, // unit is s
        isEncrypt: true,
    }

    private static instance: Repository

    private storage: Storage = window.localStorage

    constructor() {
        if (!Repository.instance) {
            Repository.instance = this
        }
        return Repository.instance
    }

    // expire unit is s
    public set(key: string, value: RepositoryValue<any>['value'], rewrite = false, expire?: number): boolean {
        if (value === '' || value === null || value === undefined) {
            value = null
        }

        if (this.has(key) && !rewrite) {
            return false
        }

        let data: RepositoryValue<any> = {
            value,
            time: Date.now(),
            expire: Repository.config.expire,
        }

        if (typeof expire !== 'undefined') {
            if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number greater than or equal to zero')
            data.expire = expire
        }

        const encryptString = Repository.config.isEncrypt ? this.encrypt(JSON.stringify(data)) : JSON.stringify(data)

        this.storage.setItem(this.formatKey(key), encryptString)
        return true
    }

    public get<T>(key: string): T | null {
        key = this.formatKey(key)
        const result = this.storage.getItem(key)
        if (!result) {
            return null
        }

        const data: RepositoryValue<T> = Repository.config.isEncrypt
            ? JSON.parse(this.decrypt(result))
            : JSON.parse(result)

        const nowTime = Date.now()

        const { expire, time, value } = data

        if (expire !== 0 && expire * 1000 < nowTime - time) {
            this.remove(key)
            return null
        }
        return value
    }

    public has(key: string): boolean {
        key = this.formatKey(key)
        return !!this.storage.getItem(key)
    }

    public remove(key: string) {
        key = this.formatKey(key)
        this.storage.removeItem(key)
    }

    public removeAll() {
        this.storage.clear()
    }

    private encrypt(data: string): string {
        const dataHex = CryptoJS.enc.Utf8.parse(data)
        const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        })
        return encrypted.ciphertext.toString()
    }

    private formatKey(key: string): string {
        return Repository.config.namespace + '_' + key
    }

    private decrypt(data: string): string {
        const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
        const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        })
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    }
}

const repository = new Repository()

export { repository as default, Repository }
