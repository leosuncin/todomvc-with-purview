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
    return (
      <div>
        <form onSubmit={this.addTodoHandler.bind(this)}>
          <input type="text" name="title" required />
          <button type="submit">Add</button>
        </form>
        <ul>
          {this.state.todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoMVC;
