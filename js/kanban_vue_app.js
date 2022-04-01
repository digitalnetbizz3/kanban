var taskToEdit = null;

const defaultData = {
    running: 1,
    categories: [{name: 'New'}, {name: 'In Progress'}, {name: 'Testing'}, {name: 'Completed'}],
    users: [{name: 'Me'},{name:'Kenny'}, {name:'Joel'}, {name:'Jayden'}],
    tasks: [
        {
            category: 'New',
            id: 0,
            name: 'How to use: 1. click on + to add new task, drag and move them to different stages if needed.',
            priority: 'P2',
            assign: 'Me',
            added: '2022-03-22',
            due: '',
            comments: []
        },
    ],
};
const storageName = 'data-kanban';
const app = Vue.createApp({
    data() {
        let data = null;
        let persistence = localStorage.getItem(storageName);
        if (persistence != null) {
            data = JSON.parse(persistence);
            if (data.tasks.length > 0 && data.users.length > 0 && data.categories.length > 0) {
                // validation
                return data;
            }
        } 
        data = defaultData;
        localStorage.setItem(storageName, data);
        return data;
    },
    methods: {
        filterTasks(category) {
            return this.tasks.filter(task => {
                return task.category == category;
            });
        },
        addTask(node) {
            node.id = this.running++;
            this.tasks.push(node);
            this.persist();
        },
        addUser(userName, idx, isBefore) {
            let userMatch = this.users.find(user => user.name == userName);
            if (userMatch == undefined || userMatch.length == 0) {
                let newIdx = (isBefore) ? idx : idx+1;
                this.users.splice(newIdx, 0, {name : userName});
                this.persist();
            }
        },
        addCategory(categoryName, idx, isBefore) {
            let categoryMatch = this.categories.find(cat => cat.name == categoryName);
            if (categoryMatch == undefined || categoryMatch.length == 0) {
                let newIdx = (isBefore) ? idx : idx+1;
                this.categories.splice(newIdx, 0, {name : categoryName});
                this.persist();
            }
        },
        moveTask(id, newCategory) {
            let task = this.tasks.find(task => task.id == id);
            if (task.category != newCategory) {
                task.category = newCategory;
                this.persist();
            }
        },
        persist() {
            let data = JSON.stringify(this.$data);
            localStorage.setItem(storageName, data);
        },
        getJSON() {
            return JSON.stringify(this.$data, undefined, 4);
        },
        removeTask(id) {
            this.tasks = this.tasks.filter(task => task.id != id);
            this.persist();
        },
        removeUser(userName) {
            this.users = this.users.filter(user => user.name != userName);
            this.persist();
        },
        removeCategory(category) {
            this.categories = this.categories.filter(cat => cat.name != category);
            this.persist();
        },
        findTask(id) {
            let array = this.tasks.filter(task => task.id == id);
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
    },
}).mount('#app');