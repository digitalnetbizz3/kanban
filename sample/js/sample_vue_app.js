var gapp = null

function vueLoad() {
    gapp = Vue.createApp({
        mounted() {
            appLoad(this)
        },
        data() {
            return { "data": 1}
        },
        methods: {
            foo(item) {
                showLoad();
            }
        },
    })
    loadComponents()

    gapp.mount('#app');
}

let componentStore = new Map()
function registerComponent(component) {
    componentStore.set(component.name, component.componentLoad)
}

function loadComponents() {
    componentStore.forEach((value, key, map) => {
        value()       
    })
}