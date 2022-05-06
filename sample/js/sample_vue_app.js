function vueLoad() {
    window._app = Vue.createApp({
        data() {
            return { "data": 1}
        },
        methods: {
            foo(item) {
                alert(item)
            }
        },
    })
    loadComponents()

    window._app.mount('#app');
    toast_dialog.show('hello world')
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