import {get} from "../index"

async function getTest() {
    return await get('/api/yujing/sisetu',{})
}
export {
    getTest
}
