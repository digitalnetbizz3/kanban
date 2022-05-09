var storageName = 'data-gantt';
var gapp = null

const defaultData = {
    running: 4,
    selectedId: 1,
    resources: [
        {
            id: 1,
            name: 'Resource A',
            items: [
                {
                    id: 3,
                    name: "work-item 1",
                    startdate: '2022-01-01',
                    duration: 5
                }
            ],
        },
        {
            id: 2,
            name: 'Resource B',
            items: [],
        }
    ]
}

function vueLoad() {
    gapp = Vue.createApp({
        mounted() {
            appLoad(this)
        },
        data() {
            let data = null;
            let persistence = localStorage.getItem(storageName);
            if (persistence != null) {
                try {
                    data = JSON.parse(persistence);
                    if (data.resources.length > 0) {
                        return data;
                    }
                } catch {
                    data = defaultData;
                    localStorage.setItem(storageName,  JSON.stringify(data));
                    return data;
                }
            } 
            data = defaultData;
            localStorage.setItem(storageName, JSON.stringify(data));
            return data;
        },
        methods: {
            getMarkDown() {
                var markdown = 'gantt\ndateFormat  YYYY-MM-DD\n';
                
                this.resources.forEach(resource => {
                        markdown += "section " + resource.name + "\n"
                        resource.items.forEach(item => {
                            let line = item.name + '\t\t' + ':a' + item.id + ', ' + item.startdate + ', ' + item.duration + 'd\n'
                            markdown += line
                        })
                });

                return markdown;
            },
            updateId(id) {
                this.selectedId = id
            },
            getContext() {
                return this.resources.filter(c => c.id == this.selectedId)[0]
            },
            reorderResource(from, to) {
                this.resources.splice(to, 0, this.resources.splice(from, 1)[0]);
            },
            addResource(name) {
                let match = this.resources.filter(resource => resource.name == name);
                if (match == undefined || match.length == 0) {
                    this.resources.push({id: this.running++, name: name, items: []});
                    this.persist();
                }
            },
            removeResource(id) {
                this.resources = this.resources.filter(resource => resource.id != id);
                this.updateId(this.resources[0].id)
                this.persist();
            },          
            findResource(id) {
                let array = this.resources.filter(resource => resource.id == id);
                if (array.length > 0) {
                    return array[0];
                }
                return null;
            },
            findWorkItemFromContext(id) {
                let curr = this.getContext()
                let array = curr.items.filter(item => item.id == id)
                if (array.length > 0) {
                    return array[0]
                }
                return null
            },
            removeWorkItem(id) {
                let currResource = this.getContext()
                currResource.items = currResource.items.filter(workitem => workitem.id != id);
                this.persist()
            },
            persist() {
                let data = JSON.stringify(this.$data);
                localStorage.setItem(storageName, data);
            },
            getLeanJSON() {
                return JSON.stringify(this.$data);
            },        
            getJSON() {
                return JSON.stringify(this.$data, undefined, 4);
            },
            reset() {
                Object.assign(this.$data, defaultData);
                this.persist();
            },
            update(updatedData) {
                Object.assign(this.$data, updatedData);
                this.persist();
            },
            changeStorage() {
                let persistence = localStorage.getItem(storageName);
                if (persistence != null) {
                    try {
                        let updatedData = JSON.parse(persistence);
                        if (updatedData.resources.length > 0) {
                            Object.assign(this.$data, updatedData);
                            return;
                        }
                    } catch(e) {}
                }
                let updatedData = defaultData;
                localStorage.setItem(storageName, JSON.stringify(updatedData));
                Object.assign(this.$data, updatedData);
            },            
            menu_clicked(item) {
                showLoad()
            },
            addWorkItem(title, startdate, duration) {
                let currResource = this.getContext()
                currResource.items.push(
                {
                    id: this.running++,
                    name: title,
                    startdate: startdate,
                    duration: duration
                })
                this.persist()
            },
            updateWorkItem(id, title, startdate, duration) {
                let workItem = this.findWorkItemFromContext(id)
                workItem.name = title
                workItem.duration = duration
                workItem.startdate = startdate
                this.persist()
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