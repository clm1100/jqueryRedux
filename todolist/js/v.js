Vue.use(Vuex);
var store = new Vuex.Store({
    state:{
        notes:[]
    },
    mutations:{
        addnotes1(state,pyload){
            state.notes.push(pyload);
        },
        getnotes(state,pyload){

        }
    },
    actions:{
        addnotes(store,payload){
            store.commit('addnotes1', payload)
        }
    },
    getters:{

    }
});

store.subscribe(function(a,b){
    console.log(a);
    console.log(b)
})
setTimeout(()=>{
    store.dispatch('addnotes', {title:"1111",done:false});
})