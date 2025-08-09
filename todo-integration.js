/* ==========================================
   TODO INTEGRATION SERVICE - COMPLETE SOLUTION
   ========================================== */

class TodoIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.todos = [];
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Todo Integration Service...');
      
      // Initialize todo save system
      const initialized = await window.todoSaveSystem.initialize();
      if (!initialized) {
        console.error('❌ Todo save system initialization failed');
        return false;
      }

      // Load existing todos
      const loadResult = await window.todoSaveSystem.loadTodos();
      if (loadResult.success) {
        this.todos = loadResult.todos;
        this.isInitialized = true;
        console.log('✅ Todo integration service initialized with', this.todos.length, 'todos');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Todo integration initialization failed:', error);
      return false;
    }
  }

  async addTodo(title, description = '', category = 'general', priority = 1, dueDate = null) {
    if (!this.isInitialized) return null;

    const result = await window.todoSaveSystem.saveTodo(title, description, false, category, priority, dueDate);
    if (result.success) {
      this.todos.push(result.data);
      return result.data;
    }
    return null;
  }

  async getTodos() {
    if (!this.isInitialized) return [];

    const result = await window.todoSaveSystem.loadTodos();
    return result.success ? result.todos : [];
  }

  async updateTodoStatus(todoId, isCompleted) {
    if (!this.isInitialized) return false;

    const result = await window.todoSaveSystem.updateTodo(todoId, { is_completed: isCompleted });
    return result.success;
  }

  async deleteTodo(todoId) {
    if (!this.isInitialized) return false;

    const result = await window.todoSaveSystem.deleteTodo(todoId);
    return result.success;
  }

  async getCompletedTodos() {
    const todos = await this.getTodos();
    return todos.filter(todo => todo.is_completed);
  }

  async getPendingTodos() {
    const todos = await this.getTodos();
    return todos.filter(todo => !todo.is_completed);
  }
}

// Initialize global todo integration service
window.todoIntegrationService = new TodoIntegrationService();

// DOM Integration
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize todo system when page loads
  await window.todoIntegrationService.initialize();
  
  // Setup todo panel functionality
  setupTodoPanel();
});

function setupTodoPanel() {
  const todoPanel = document.getElementById('todo-panel');
  if (!todoPanel) return;

  // Setup todo list rendering
  renderTodoLists();
}

async function renderTodoLists() {
  const exploredList = document.getElementById('explored-list');
  const unexploredList = document.getElementById('unexplored-list');
  
  if (!exploredList || !unexploredList) return;

  // Clear existing items
  exploredList.innerHTML = '';
  unexploredList.innerHTML = '';

  // Load and render todos
  const todos = await window.todoIntegrationService.getTodos();
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-title">${todo.title}</span>
      <span class="todo-description">${todo.description || ''}</span>
      <button class="todo-toggle" onclick="toggleTodoStatus('${todo.id}', ${todo.is_completed})">
        ${todo.is_completed ? '✅' : '⭕'}
      </button>
      <button class="todo-delete" onclick="deleteTodo('${todo.id}')">🗑️</button>
    `;
    
    if (todo.is_completed) {
      exploredList.appendChild(li);
    } else {
      unexploredList.appendChild(li);
    }
  });
}

// Global functions for UI interaction
async function toggleTodoStatus(todoId, isCompleted) {
  const result = await window.todoIntegrationService.updateTodoStatus(todoId, !isCompleted);
  if (result) {
    await renderTodoLists();
  }
}

async function deleteTodo(todoId) {
  const result = await window.todoIntegrationService.deleteTodo(todoId);
  if (result) {
    await renderTodoLists();
  }
}

// Export for use in other modules
window.TodoIntegrationService = TodoIntegrationService;
