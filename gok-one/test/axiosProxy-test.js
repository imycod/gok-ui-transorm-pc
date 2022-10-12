/**
 *  测试用例
 * 
 *  测试http模块
 */
import axiosProxy from '../axios/axiosProxy'
import expect from 'expect'

describe('axiosProxy 请求测试', function() {
    it('请求应该返回正常', function(done) {
        axiosProxy.post('http://testapi.goktech.cn/uc/v1/users/pwd-login/init',{
            data: {
                'username' : 'admin'
            },
            headers: {
                'Content-Type': '',
                'X-AppVer': 'pc:operation:pc:1.0'
            }
        }).then(res =>{
            expect(res).not.toBeUndefined()
            done()
        }).catch(err => {
            console.log(err.response.data)
            expect(err.response.status).toBe(200)
            done()
        })
    })
})



