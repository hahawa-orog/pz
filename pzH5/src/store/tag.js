const state={
     active :  localStorage.getItem('active') 
}

const mutations={
    changeActive(state,payload){
        state.active=payload
        localStorage.setItem('active',payload)
        console.log('state.active',state.active);
    }
}
export default{
    state,
    mutations
}