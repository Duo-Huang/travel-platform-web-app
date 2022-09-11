import repository from '@/utils/repository'

describe('Test repository', () => {
    beforeEach(() => {
        repository.removeAll()
    })

    it('Should store data', () => {
        const storeData = [
            {
                id: 'x1',
                code: 'bnm',
            },
            {
                id: 'x2',
                code: 'mbnm',
            },
        ]
        const result = repository.set('storeData', storeData)
        expect(result).toBe(true)
        expect(repository.get('storeData')).toEqual(storeData)
    })

    it('Should store data 30 days with defaut configuration', () => {
        const storeData = 123
        const duration = 30 * 24 * 60 * 60 * 1000 // 30 days
        vi.useFakeTimers()
        vi.setSystemTime(Date.now() - duration) // 30 days ago, [You can't simulate after 30 days, it will cause some bugs, ref to https://cn.vitest.dev/api/#vi-setsystemtime]
        const result = repository.set('storeData', storeData)
        expect(result).toBe(true)
        expect(repository.get('storeData')).toBe(storeData)
        vi.useRealTimers()
        setTimeout(() => {
            // Immediate assertion is less stable
            expect(repository.get('storeData')).toBe(null)
        })
    })

    it('Should store data a period of time with spec configuration', () => {
        const storeData = 123
        vi.useFakeTimers()
        vi.setSystemTime(Date.now() - 300 * 1000) // 300 s ago, [You can't simulate after 300 s, it will cause some bugs, ref to https://cn.vitest.dev/api/#vi-setsystemtime]
        const result = repository.set('storeData', storeData, false, 300) // 300 s
        expect(result).toBe(true)
        expect(repository.get('storeData')).toBe(storeData)
        vi.useRealTimers()
        setTimeout(() => {
            // Immediate assertion is less stable
            expect(repository.get('storeData')).toBe(null)
        })
    })

    it('Should store fail when key exists and rewrite is not specified', () => {
        const storeData = 123
        const result1 = repository.set('storeData', storeData)
        const result2 = repository.set('storeData', 456)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(repository.get('storeData')).toBe(storeData)
    })

    it('Should store fail when key exists and specify rewrite is false', () => {
        const storeData = 123
        const result1 = repository.set('storeData', storeData, false)
        const result2 = repository.set('storeData', 456)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(repository.get('storeData')).toBe(storeData)
    })

    it('Should stored successfully when key exists and specify rewrite is true', () => {
        const storeData = 123
        const result1 = repository.set('storeData', storeData)
        const result2 = repository.set('storeData', 456, true)
        expect(result1).toBe(true)
        expect(result2).toBe(true)
        expect(repository.get('storeData')).toBe(456)
    })

    it('Should get null when stored data has been removed', () => {
        const storeData = 123
        const result = repository.set('storeData', storeData)
        expect(result).toBe(true)
        expect(repository.get('storeData')).toBe(storeData)
        repository.remove('storeData')
        expect(repository.get('storeData')).toBe(null)
    })

    it('Should remove all data', () => {
        const result1 = repository.set('abc', 1)
        const result2 = repository.set('def', 2)
        expect(result1).toBe(true)
        expect(result2).toBe(true)
        expect(repository.get('abc')).toBe(1)
        expect(repository.get('def')).toBe(2)
        repository.removeAll()
        expect(repository.get('abc')).toBe(null)
        expect(repository.get('def')).toBe(null)
    })
})
