import expect from 'expect'
import oneBuilder from '../index'

describe('one 构建测试', function() {
    it('正确挂载所有模块', function(done) {
        const one = oneBuilder.appVersion('pc:operation:pc:1.0')
            .env(oneBuilder.mode.dev)
            .build()
            .init()
        console.log(one)
        expect(one).not.toBeUndefined()
        done()
    })
})