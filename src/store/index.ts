import { autorun, makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

export class Todo {
  id: string;
  title: string;
  isCompleted: boolean;

  constructor({ title, isCompleted = false }: Partial<Todo>) {
    this.id = `td_${nanoid()}`;
    this.title = title;
    this.isCompleted = isCompleted;

    makeAutoObservable(this);
  }

  toggleCompleted = () => {
    this.isCompleted = !this.isCompleted;
  };

  setTitle = (title: string) => {
    this.title = title;
  };
}

export class Store {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);

    this.autoSave();
  }

  autoSave = async () => {
    // get all saved todos on load
    try {
      const todos = await window.bridge.getItem("todos");

      if (todos) {
        const parsedTodos = JSON.parse(todos);

        this.clear();

        parsedTodos.forEach((todo: Todo) =>
          this.addTodo({
            title: todo.title,
            isCompleted: todo.isCompleted,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }

    // save todos on change
    autorun(() => {
      console.log("this ran");
      const todos = this.todos.map((todo) => ({
        title: todo.title,
        isCompleted: todo.isCompleted,
      }));

      const stringifiedTodos = JSON.stringify(todos);

      try {
        window.bridge.setItem("todos", stringifiedTodos);
      } catch (error) {
        console.error(error);
      }
    });
  };

  addTodo = (props: Partial<Todo>) => {
    this.todos.push(new Todo(props));
  };

  removeTodo = (id: string) => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };

  clear = () => {
    this.todos = [];
  };
}

export default new Store();
