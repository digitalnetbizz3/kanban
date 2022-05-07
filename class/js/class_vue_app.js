
const defaultData = {
    running: 1,
    selectedId: 0,
    classes: [
    {
         id: 0,
         name: "SampleClass",
         methods: [
             {
                 name: "MethodA",
                 access: "+",
                 static: false, 
             }
         ],
         fields: [
             {
                 name: "FieldA",
                 access: "-",
                 static: false,
             }
         ]
    }],
    links: [
    ],
    relations: [
        {
            name: "Inheritance",
            symbol: "--|>"
        },
        {
           name: "Composition",
           symbol: "--*"
        },   
        {
           name: "Aggregation",
           symbol: "--o"
        }, 
        {
           name: "Association",
           symbol: "-->"
        }, 
        {
           name: "Dependency",
           symbol: "..>"
        }, 
        {
           name: "Realization",
           symbol: "--|>"
        }, 
        {
           name: "Interface Impl",
           symbol: ".."
        },                                                                            
    ]    
};
var storageName = 'data-class';
var gapp = null;

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
                    if (data.classes.length > 0) {
                        // validation
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
                var markdown = 'classDiagram\n';
                this.classes.forEach(item => {
                    var classText = ''
                    if (item.methods.length > 0 || item.fields.length > 0) {
                        classText = "class " + item.name + '{\n';
                        item.fields.forEach(field => {
                            classText += (field.access + field.name) + ((field.static) ? '$' : '') + '\n'
                        })
        
                        item.methods.forEach(method => {
                            classText += (method.access + method.name) + '(...)' + ((method.static) ? '$' : '') + '\n'
                        })
                        classText += '}\n'
                    } else {
                        classText += "class " + item.name + '\n'
                    }
                    markdown += classText
                });
                this.links.forEach(link => {
                    let linkText = link.from + ' ' + this.linkSymbolLookup(link.relationship) + ' ' + link.to + ':' + link.relationship + '\n'
                    markdown += linkText
                });
                //alert(markdown)
                return markdown;
            },
            linkSymbolLookup(name) {
                let array = this.relations.filter(c => c.name == name);
                return array[0].symbol
            },
            updateId(id) {
                this.selectedId = id
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
            getContext() {
                return this.classes.filter(c => c.id == this.selectedId)[0]
            },
            getCandidates() {
                return this.classes.filter(c => c.id != this.getContext().id)
            },
            getLinksFromContext() {
                return this.links
            },
            addLink(toClass, fromClass, relation) {
                let node = {id: this.running++, from: fromClass, to: toClass, relationship: relation}
                this.links.push(node)
                this.persist()
            },
            removeLink(id) {
                this.links = this.links.filter(c => c.id != id)
                this.persist()
            },        
            addClass() {
                let node = {id: this.running++, name: "NewClass1", methods: [], fields: []}
                this.classes.push(node)
                this.updateId(node.id)
                this.persist();
            },
            removeClass(id) {
                let ctx = this.findClass(id)
                this.classes = this.classes.filter(c => c.id != id)
                this.links = this.links.filter(l => (l.from != ctx.name && l.to != ctx.name))
                this.persist()
            },
            updateClassName(name) {
                let newClassName = name
                let currClassName = app.getContext().name
                app.getContext().name = newClassName
                this.links.forEach(link => {
                    if(link.from == currClassName) {
                        link.from = newClassName
                    }
                    if(link.to == currClassName) {
                        link.to = newClassName
                    }                
                })
                this.persist()
            },
            addMethodToContext(node) {
                this.getContext().methods.push(node)
                app.persist();
            },
            removeMethodFromContext(name) {
                let context = this.getContext();
                context.methods = context.methods.filter(c => c.name != name)
                this.persist();
            },
            addFieldToContext(node) {
                app.getContext().fields.push(node)
                app.persist();
            },        
            removeFieldFromContext(name) {
                let context = this.getContext();
                context.fields = context.fields.filter(c => c.name != name)
                this.persist();
            },
            findClassByIndex(idx) {
                return this.classes[idx]
            },
            findClass(id) {
                let array = this.classes.filter(c => c.id == id);
                if (array.length > 0) {
                    return array[0];
                }
                return null;
            },
            findClassByName(name) {
                let array = this.classes.filter(c => c.name == name);
                if (array.length > 0) {
                    return array[0];
                }
                return null;
            },        
            reset() {
                Object.assign(this.$data, defaultData);
                this.persist();
            },
            update(updatedData) {
                Object.assign(this.$data, updatedData);
                this.persist();
            },
            refresh() {
                this.$forceUpdate(); 
            },
            changeStorage() {
                let persistence = localStorage.getItem(storageName);
                if (persistence != null) {
                    try {
                        let updatedData = JSON.parse(persistence);
                        if (updatedData.classes.length > 0) {
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
        },
    })
    loadComponents()
    gapp.mount('#app')
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