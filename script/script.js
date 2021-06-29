new Vue({
    el: '#app',
    data() {
        return {
            TODOKEY: 'todo',
            todos: [],
            maxId: 0,
            text: '',
        };
    },
    created: function () {
        vueObj = this;
        const key = vueObj.TODOKEY;
        const storage = localStorage;
        const jsonObj = JSON.parse(storage.getItem(key));
        const todoList = jsonObj[key];
        // If localStorage is empty, todoList is undefined
        if (todoList === undefined) {
            vueObj.todos = [];
        } else {
            // set todoList
            vueObj.todos = todoList;
            // set maxId
            todoList.forEach(todo => {
                if (vueObj.maxId < todo['id']) vueObj.maxId = todo['id'];
            });
        }
    },
    computed: {
        dones() {
            return this.todos.filter(todo => todo.isDone == true);
        },
        incompleteTodo() {
            return this.todos.filter(todo => todo.isDone == false);
        },
    },
    methods: {
        inputText(e) {
            this.text = e.target.value;
        },
        /**
         * TODOリストに入力内容を追加する
         * idのインクリメントして入力内容とオブジェクトにしてリストに追加
         * 入力フォームはリセットする
         */
        addTodo() {
            if (!this.text) return;

            const text = this.text;
            const id = ++this.maxId;
            const todo = {
                id,
                text,
                isDone: false
            };
            this.todos.push(todo);
            this.saveTodoList();
            this.resetText();
        },
        resetText() {
            this.text = '';
        },
        deleteTodo(id) {
            const index = this.getIndexById(id);
            this.todos.splice(index, 1);
            this.saveTodoList();
        },
        toggleIsDone(id) {
            const index = this.getIndexById(id);
            this.todos[index].isDone = !this.todos[index].isDone;
            this.saveTodoList();
        },
        getIndexById(id) {
            return this.todos.findIndex(todo => todo.id === id);
        },
        /**
         * Don't forget call this method when todos is changed.
         */
        saveTodoList() {
            const key = this.TODOKEY;
            const todosObj = { [key]: this.todos };
            localStorage.setItem(key, JSON.stringify(todosObj));
        }
    }
});