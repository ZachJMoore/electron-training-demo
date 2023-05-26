import { observer } from "mobx-react-lite";
import store, { Store, Todo } from "../../store";
import styles from "./index.module.scss";
import { useState } from "react";

type TodoItemProps = {
  todo: Todo;
};

export const NewTodoItem = ({ store }: { store: Store }) => {
  const [title, setTitle] = useState("");
  return (
    <form
      className={styles.root}
      onSubmit={(e) => {
        e.preventDefault();
        setTitle("");
        store.addTodo({
          title,
        });
      }}
    >
      <input
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
        required
      />
      <button className={styles.submitButton} type="submit" disabled={!title}>
        Add
      </button>
    </form>
  );
};

const TodoItem = ({ todo }: TodoItemProps) => (
  <div className={styles.root}>
    <input
      className={styles.checkbox}
      type="checkbox"
      checked={todo.title && todo.isCompleted}
      onChange={() => todo.toggleCompleted()}
      disabled={!todo.title}
    />
    <div className={styles.titleContainer}>
      <input
        className={styles.titleInput}
        value={todo.title}
        onChange={(e) => todo.setTitle(e.target.value)}
        placeholder="Enter a title"
        disabled={todo.isCompleted}
        onBlur={() => {
          if (!todo.title) {
            store.removeTodo(todo.id);
          }
        }}
      />
      <div className={styles.strike} />
    </div>
  </div>
);

export default observer(TodoItem);
