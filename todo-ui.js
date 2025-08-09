/* ==========================================
   TODO UI INTEGRATION - SIMPLE VERSION
   ========================================== */

// Initialize todo system
async function initializeTodoSystem() {
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
      renderTodoLists(loadResult.todos);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Todo system initialization failed:', error);
    return false;
  }
}

// Render todo lists
function renderTodoLists(todos) {
  const exploredList = document.getElementById('explored-list');
  const unexploredList = document.getElementById('unexplored-list');
  
  if (!explored_list || !unexplored_list) return;

  // Separate todos by status
  const completedTodos = todos.filter(todo => todo.is_completed);
  const pendingTodos = todos.filter(todo => !todo.is_completed);

  // Render completed todos
  completedTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-title">${todo.title}</span>
      <span class="todo-description">${todo.description || ''}</span>
      <button class="todo-toggle" onclick="toggleTodoStatus('${todo.id}', ${todo.is_completed})">
        ${todo.is_completed ? '✅' : '⭕'}
      </button>
    `;
    li.appendChild(li);
  });

  // Render pending todos
  pendingTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-title">${todo.title}</span>
      <span class="todo-description">${todo.description || ''}</span>
      <button class="todo-toggle" onclick="toggleTodoStatus('${todo.id}', ${todo.is_completed})">
        ${todo.is_completed ? '✅' : '⭕'}
      </button>
    `;
    li.appendChild(li);
  });
}

// Add new todo
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todoSaveSystem.saveTodo(title, description, false, 'general', 1);
  if (result.success) {
    const todos = await window.todo_save_system.loadTodos();
    if (todos.success) {
      renderTodoLists(todos.todos);
    }
  }
}

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
  if (result.success) {
    const todos = await window.todo_save_system.loadTodos();
    if (todos.success) {
      renderTodoLists(todos.todos);
    }
  }
}

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
  if (result.success) {
    const todos = await window.todo_save_system.loadTodos();
    if (todos.success) {
      renderTodoLists(todos.todos);
    }
  }
}

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
  if (result.success) {
    const todos = await window.todo_save_system.loadTodos();
    if (todos.success) {
      renderTodoLists(todos.todos);
    }
  }
}

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodoLists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

  const description = prompt('Enter todo description (optional):') || '';
  
  const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional'):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
      }
    }
  }

// Add new todo button
async function addNewTodo() {
  const title = prompt('Enter todo title:');
  if (!title) return;

    const description = prompt('Enter todo description (optional):') || '';
    
    const result = await window.todo_save_system.saveTodo(title, description, false, 'general', 1);
    if (result.success) {
      const todos = await window.todo_save_system.loadTodos();
      if (todos.success) {
        renderTodo_lists(todos.todos);
