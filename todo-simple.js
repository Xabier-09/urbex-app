/* ==========================================
   TODO SIMPLE INTEGRATION
   ========================================== */

// Initialize todo system
async function initTodoSystem() {
  try {
    console.log('🚀 Initializing Todo System...');
    
    // Initialize todo save system
    const initialized = await window.todoSaveSystem.initialize();
    if (!initialized) {
      console.error('❌ Todo save system initialization failed');
      return false;
    }

    // Load existing todos
    const loadResult = await window.todoSaveSystem.loadTodos();
    if (loadResult.success) {
      console.log('✅ Todo system initialized with', loadResult.todos.length, 'todos');
      renderTodos(loadResult.todos);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Todo system initialization failed:', error);
    return false;
  }
}

// Render todos in lists
function renderTodos(todos) {
  const exploredList = document.getElementById('explored-list');
  const unexploredList = document.getElementById('unexplored-list');
  
  if (!exploredList || !unexploredList) return;

  // Clear existing items
  exploredList.innerHTML = '';
  unexploredList.innerHTML = '';

  // Separate todos by status
  const completed = todos.filter(todo => todo.is_completed);
  const pending = todos.filter(todo => !todo.is_completed);

  // Render completed todos
  completed.forEach(todo => {
    const li = createTodoElement(todo);
    exploredList.appendChild(li);
  });

  // Render pending todos
  pending.forEach(todo => {
    const li = createTodoElement(todo);
    unexploredList.appendChild(li);
  });
}

// Create todo element
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <span>${todo.title}</span>
    <button onclick="toggleTodo('${todo.id}', ${todo.is_completed})">
      ${todo.is_completed ? '✅' : '⭕'}
    </button>
  `;
  return li;
}

// Toggle todo status
async function toggleTodo(todoId, currentStatus) {
  const result = await window.todoSaveSystem.updateTodo(todoId, { is_completed: !currentStatus });
  if (result.success) {
    const todos = await window.todoSaveSystem.loadTodos();
    if (todos.success) {
      renderTodos(todos.todos);
    }
  }
}

// Add new todo
async function addTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter description (optional):') || '';
  
  const result = await window.todoSaveSystem.saveTodo(title, description, false, 'general', 1);
  if (result.success) {
    const todos = await window.todoSaveSystem.loadTodos();
    if (todos.success) {
      renderTodos(todos.todos);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await initTodoSystem();
});

// Make functions available globally
window.addTodo = addTodo;
window.toggleTodo = toggleTodo;
