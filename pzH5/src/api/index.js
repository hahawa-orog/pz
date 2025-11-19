import request from '../utils/request.js'

export default {
    login(data){
        return request({method:'post',url:'/login',data})
    },

    getIndex(){
        return request({method:'get',url:'/Index/index'})
    },

    h5Companion(){
        return request({method:'get',url:'/h5/companion'})
    },

    createOrder(data){
        return request({method:'post',url:'/createOrder',data})
    },

    orderList(params){
        return request({method:'get',url:'/order/list',params})
    },

    
    orderDetail(oid){
        return request({method:'get',url:'/order/detail',params:{oid}})
    }

}