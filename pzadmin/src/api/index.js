import request from '../utils/request'


// 获取验证码  需要携带一个请求体body,是一个对象，axiox里携带请求体应该放在data里，参考axios官网
export const getCode = (data)=>{
     return request({method:'post' , url : '/get/code' ,data})
}


// 验证验证码
export const  userAuthentication=(data)=>{
     return request({method:'post',url:'/user/authentication',data})
}


//登录接口
export const login=(data)=>{
     return request({method:'post',url:'/login',data})
}


// 账号管理列表
export const authAdmin=(params)=>{
     return request({method:'get',url:'/auth/admin',params})
}


// 权限菜单数据
export const userGetMenu=()=>{
     return request({method:'get',url:'/user/getmenu'})
}


// 权限修改
export const userSetMenu = (data)=>{
     return request({method:'post',url:'/user/setmenu',data})
}

// 获取权限列表
export const menuList=(params)=>{
     return request({method:'get',url:'/menu/list',params})
}


// 菜单权限下拉
export const menuSelectList=()=>{
     return request({method:'get',url:'/menu/selectlist'})
}


// 用户信息修改
export const updateUser = (data)=>{
     return request({method:'post',url:'/update/user',data})
}


// 用户菜单权限
export const menuPermissions=()=>{
     return request({method:'get',url:'/menu/permissions'})
}


// 陪护师头像
export const photoList=()=>{
     return request({method:'get',url:'/photo/list'})
}

// 陪护师创建
export const Companion = (data)=>{
     return request({method:'post',url:'/companion',data})
}


// 获取陪护师列表

export const CompanionList = (params)=>{
     return request({method:'get',url:'/companion/list',params})
}



// 删除陪护师

export const deleteCompanion = (data)=>{
     return request({method:'post',url:'/delete/companion',data})
}




// 订单列表
export const adminOrder=(params)=>{
     return request({method:'get',url:'/admin/order',params})
}

// 订单完成
export const updateOrder=(data)=>{
     return request({method:'post',url:'/update/order',data})
}