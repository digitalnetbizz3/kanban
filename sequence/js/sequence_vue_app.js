var taskToEdit = null;

const defaultData = {
    running: 3,
    users: [{name: 'User', type: 'actor'}, {name: 'My Website', type: 'participant'}],
    arrows: [
        {name: 'Solid line with arrow', notation: '->>'},
        {name: 'Dotted line with arrow', notation: '-->>'},
        {name: 'Solid line', notation: '->'},
        {name: 'Dotted line', notation: '-->'},
        {name: 'Solid line with x', notation: '-x'},
        {name: 'Dotted line with x', notation: '--x'},
        {name: 'Solid line with arrow (async)', notation: '-)'},
        {name: 'Dotted line with arrow (async)', notation: '--)'},
    ],
    sequences: [
        {
            type: 'msg',
            from: 'User',
            to: 'My Website',
            id: 0,
            msg: 'request HTML',
            arrow: '->>'
        },
        {
            type: 'note',
            from: 'My Website',
            id: 2,
            note: 'hosted on cloud',
            position: 'right of'
        },
        {
            type: 'msg',
            to: 'User',
            from: 'My Website',
            id: 1,
            msg: 'HTML response',
            arrow: '->>'
        },
    ],
};
var storageName = 'data-sequence';
var app = null;

function vueLoad() {
    app = Vue.createApp({
    data() {
        let data = null;
        let persistence = localStorage.getItem(storageName);
        if (persistence != null) {
            try {
                data = JSON.parse(persistence);
                if (data.users.length > 0) {
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
            var markdown = 'sequenceDiagram\n';
            this.users.forEach(item => {
                markdown += item.type + " " + item.name.replace('-','#8211;') + '\n';
            });
            this.sequences.forEach(item => {
                if (item.type == 'msg') {
                    markdown += item.from + item.arrow + item.to + ":" + item.msg + '\n';
                } else if (item.type == 'note') {
                    markdown += 'Note ' + item.position + ' ' + item.from + ":" + item.note + '\n';
                }
                
            });
            return markdown;
        },
        reorderUser(from, to) {
            this.users.splice(to, 0, this.users.splice(from, 1)[0]);
        },
        filterArrows(value) {
            return this.arrows.filter(arrow => {
                return arrow.name == value;
            });
        },
        filterArrowsByNotation(notation) {
            return this.arrows.filter(arrow => {
                return arrow.notation == notation;
            });
        },
        addSequence(node) {
            node.id = this.running++;
            this.sequences.push(node);
            this.persist();
        },
        addUser(name, type) {
            let userMatch = this.users.find(user => user.name == name);
            if (userMatch == undefined || userMatch.length == 0) {
                this.users.push({name: name, type: type});
                this.persist();
            }
        },
        moveSequence(sourceId, destId) {
            let sourceNode = this.findSequence(sourceId);
            let destNode = this.findSequence(destId);

            let fromIndex = this.sequences.indexOf(sourceNode);
            let toIndex = this.sequences.indexOf(destNode);

            if (fromIndex != -1 && toIndex != -1) {
                this.sequences.splice(toIndex, 0, this.sequences.splice(fromIndex, 1)[0]);
                this.persist();
            }
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
        removeSequence(id) {
            this.sequences = this.sequences.filter(item => item.id != id);
            this.persist();
        },
        removeUser(userName) {
            this.users = this.users.filter(user => user.name != userName);
            this.persist();
        },
        findSequence(id) {
            let array = this.sequences.filter(item => item.id == id);
            if (array.length > 0) {
                return array[0];
            }
            return null;
        },
        findUser(name) {
            let array = this.users.filter(user => user.name == name);
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
                    if (updatedData.users.length > 0) {
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
appLoad();
}
