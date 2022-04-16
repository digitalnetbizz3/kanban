var taskToEdit = null;

const defaultData = {
    running: 1,
    rules: [
        {name: 'start', startNotation: '(', endNotation: ')', outgoing: '1', incoming: '0'}, 
        {name: 'end', startNotation: '(', endNotation: ')', outgoing: '0', incoming: '1'}, 
        {name: 'process', startNotation: '[', endNotation: ']', outgoing: '1', incoming: '1'},
        {name: 'storage', startNotation: '[(', endNotation: ')]', outgoing: '0', incoming: 'N'},
        {name: 'decision', startNotation: '{', endNotation: '}', outgoing: 'N', incoming: 'N'},
    ],
    shapes: [
        {type: 'start', title: 'start', id:0, incoming: 0, outgoing: 0 }
    ],
    links: [

    ],
};
var storageName = 'data-flow';
const app = Vue.createApp({
    data() {
        let data = null;
        let persistence = localStorage.getItem(storageName);
        if (persistence != null) {
            try {
                data = JSON.parse(persistence);
                if (data.shapes.length > 0) {
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
    computed: {

    },
    methods: {
        getMarkDown() {
            var lineItem = '';
            var markdown = 'flowchart TB\n';
            this.shapes.forEach(item => {
                let rules = this.filterRules(item.type);
                if (rules.length == 1) {
                    let rule = rules[0];
                    lineItem = item.id + rule.startNotation + item.title + rule.endNotation + '\n';
                }
                markdown += lineItem;
            });
            this.links.forEach(link => {
                var linkItem;
                if (link.linkText.length > 0) {
                    linkItem = link.fromId + '-->|' + link.linkText + '|' + link.toId + '\n';
                } else {
                    linkItem = link.fromId + '-->'+ link.toId + '\n';
                }
                markdown += linkItem;
            });
            //alert(markdown)
            return markdown;
        },
        filterRules(name) {
            return this.rules.filter(item => {
                return item.name == name;
            });
        },
        persist() {
            let data = JSON.stringify(this.$data);
            localStorage.setItem(storageName, data);
        },
        getJSON() {
            return JSON.stringify(this.$data, undefined, 4);
        },
        removeShape(id) {
            let links = this.findLinkAssociateToShape(id);
            links.forEach(link => {
                this.removeLink(link.id)
            });
            this.shapes = this.shapes.filter(shape => shape.id != id);
            this.persist();
        },
        addShape(type, title) {
            let node = {type: type, title: title, id: this.running++, incoming:0, outgoing:0}
            this.shapes.push(node)
            this.persist();
        },
        addLink(fromId, toId, linkText) {
            let node = {id: this.running++, fromId: fromId, toId: toId, linkText: linkText}
            this.findShape(fromId).outgoing++;
            this.findShape(toId).incoming++;
            this.links.push(node)
            this.persist();
        },
        removeLink(linkId) {
            let link = this.findLink(linkId);
            let fromShape = this.findShape(link.fromId);
            let toShape = this.findShape(link.toId);
            fromShape.outgoing--;
            toShape.incoming--;
            this.links = this.links.filter(link => link.id != linkId);
        },
        getLinkFrom(fromId) {
            let array = this.links.filter(link => link.fromId == fromId);
            return array;
        },
        getConnectionCandidates(selectedShape) {
            let currShape = this.findShape(selectedShape);
            let rule = this.filterRules(currShape.type)[0];
            if (rule.outgoing != 'N') {
                let howMany = parseInt(rule.outgoing);
                if (currShape.outgoing >= howMany) {
                    return [];
                }
            }
            if (currShape.type == 'storage' || currShape.type == 'end') {
                return [];
            }
            let result = this.shapes.filter(shape => shape.type == 'storage' || shape.type == 'decision' ||
                    (shape.incoming == 0 && shape.id != selectedShape && shape.type != 'start'));
            return result;
        },
        findLink(id) {
            let array = this.links.filter(link => link.id == id);
            if (array.length > 0) {
                return array[0];
            }
            return null;
        },
        findLinkAssociateToShape(shapeId) {
            return this.links.filter(link => link.fromId == shapeId || link.toId == shapeId);
        },
        findShape(id) {
            let array = this.shapes.filter(shape => shape.id == id);
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
        changeStorage() {
            let persistence = localStorage.getItem(storageName);
            if (persistence != null) {
                try {
                    let updatedData = JSON.parse(persistence);
                    if (updatedData.shapes.length > 0 && updatedData.rules.length > 0) {
                        Object.assign(this.$data, updatedData);
                        return;
                    }
                } catch(e) {}
            }
            let updatedData = defaultData;
            localStorage.setItem(storageName, JSON.stringify(updatedData));
            Object.assign(this.$data, updatedData);
        }
    },
}).mount('#app');
