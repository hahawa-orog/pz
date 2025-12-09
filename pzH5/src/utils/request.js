import axios from 'axios'


const http = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz',
    timeout: 10000,
    headers:{'terminal':'h5'}   //来区分前台和后台
  });

// 添加请求拦截器
http.interceptors.request.use(function (config) {

  // config.headers['terminal']='h5'
    // 判断是否需哟携带token  
    const token = localStorage.getItem('h5_token')
    const whiteUrl=['/login']  //白名单，
    if( token && !whiteUrl.includes(config.url)){  //需要携带token
        config.headers['h-token'] = token    //给请求头添加一个x-token字段
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 根据响应的数据，如果有错，给用户一个响应
    if(response.data.code == -1){
      showNotify({ message: response.data.message });
    }
    // token过期，还是可以通过全局前置路由守卫的处理，需要在相应拦截器里进行处理
    // 创建一个请求，在挂载某个组件的时候触发，然后修改一下存储的token，然后输出请求返回的结果就可以看见token过期返回的数据
    if(response.data.code==-2){       //token过期,清除存储的内容，并且跳转最初的页面
        localStorage.removeItem('h5_token')
        localStorage.removeItem('h5_userInfo')
        // window.location.href 可以简单的理解成浏览器地址栏的内容
        // window.location.origin 可以简单的理解成 协议+路由+端口
      window.location.href=window.location.origin
    }  
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  export default http