import { getRepository, Repository } from 'typeorm';

import { Todo } from '../entities/todo.entity';

export class TodoService {
  private readonly repository: Repository<Todo>;
  private static instance: TodoService;

  private constructor() {
    this.repository = getRepository(Todo);
  }

  addTodo(newTodo: Pick<Todo, 'title'>): Promise<Todo> {
    const todo = this.repository.create(newTodo);

    return this.repository.save(todo);
  }

  async listTodos(): Promise<Todo[]> {
    return this.repository.find({ order: { createdAt: 'ASC' } });
  }

  async updateTodo(
    todo: Todo,
    updates: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<Todo> {
    todo.title = updates.title || todo.title;
    todo.completed = updates.completed ?? todo.completed;

    return this.repository.save(todo);
  }

  async removeTodo(todo: Todo): Promise<Todo> {
    return this.repository.remove(todo);
  }

  static getInstance(): Readonly<TodoService> {
    if (!this.instance) {
      this.instance = new TodoService();
    }

    return this.instance;
  }
}
