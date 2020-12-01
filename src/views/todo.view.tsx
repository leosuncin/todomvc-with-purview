import Purview, { SubmitEvent } from 'purview';

import { TodoService } from '../services/todo.service';
import type { Todo } from '../entities/todo.entity';

interface TodoMVCProps {}
interface TodoState {
  todos: Todo[];
}

class TodoMVC extends Purview.Component<TodoMVCProps, TodoState> {
  private service: Readonly<TodoService>;

  constructor(props: TodoMVCProps) {
    super(props);
    this.service = TodoService.getInstance();
  }

  async getInitialState(): Promise<TodoState> {
    try {
      const todos = await this.service.listTodos();

      return { todos };
    } catch (error) {
      console.error(error);
      return { todos: [] };
    }
  }

  async addTodoHandler(event: SubmitEvent): Promise<void> {
    try {
      const todo = await this.service.addTodo(
        event.fields as Pick<Todo, 'title'>,
      );
      this.setState({
        todos: [todo, ...this.state.todos],
      });
    } catch (error) {
      console.error('addTodoHandler', error);
    }
  }

  render(): JSX.Element {
    const { todos } = this.state;
    const countCompleted = todos.reduce(
      (count, todo) => count + Number(todo.completed),
      0,
    );
    const countPending = todos.length - countCompleted;

    return (
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <form onSubmit={this.addTodoHandler.bind(this)}>
            <input
              class="new-todo"
              name="title"
              placeholder="What needs to be done?"
              autofocus
            />
          </form>
        </header>
        <section
          class="main"
          style={`display: ${todos.length == 0 ? 'hidden' : 'block'}`}
        >
          <input id="toggle-all" class="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                class={todo.completed ? 'completed' : undefined}
              >
                <div class="view">
                  <input
                    class="toggle"
                    type="checkbox"
                    checked={todo.completed}
                  />
                  <label>{todo.title}</label>
                  <button class="destroy"></button>
                </div>
                <input class="edit" defaultValue={todo.title} />
              </li>
            ))}
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count">
            <strong>{countPending}</strong> item left
          </span>
          <ul class="filters">
            <li>
              <a class="selected" href="#/">
                All
              </a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          <button
            class="clear-completed"
            style={`display: ${countPending == 0 ? 'hidden' : 'inline'}`}
          >
            Clear completed
          </button>
        </footer>
      </section>
    );
  }
}

export default TodoMVC;
