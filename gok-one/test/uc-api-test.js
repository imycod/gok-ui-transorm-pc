/**
 *  测试用例
 * 
 *  用户中心api测试
 */
import expect from 'expect'
import oneBuilder from '../index'
import { it } from 'mocha'

describe('用户中心登录api测试', function() {
    
    it('账号密码登录，应该返回登录成功', function(done) {
        // 初始化sdk
        const one = oneBuilder.version('pc:operation:pc:1.0')
            .env(oneBuilder.mode.dev)
            .redirectUrl('http://localhost')
            .build()
        one.uc.api.login('admin','123454321').then(res => {
                expect(res).not.toBeUndefined()
                console.log(res)
                done()
            }).catch(err => {
                expect(err.response.status).toBe(200)
                console.log(err.response.data)
                done()
            })
    })

    it('手机验证码登录，应该返回登录成功', function(done) {
        // 初始化sdk
        const one = oneBuilder.version('pc:teaching:pc:1.0.0')
            .env(oneBuilder.mode.dev)
            .redirectUrl('http://localhost')
            .build()
        let phone = '18800000008'
        one.uc.api.getSmsCode(phone).then(res => {
            one.uc.api.loginByPhone(phone,'1234',res.data.rid).then(res => {
                expect(res).not.toBeUndefined()
                console.log(res)
                done()
            }).catch(err => {
                console.log(err.response.data)
                expect(err.response.status).toBe(200)
                done()
            })
        }).catch(err => {
            console.log(err.response.data)
            expect(err.response.status).toBe(200)
            done()
        })
    })

})
