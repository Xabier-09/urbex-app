/* ==========================================
   TODO SAVE SYSTEM - COMPLETE SOLUTION
   ========================================== */

class TodoSaveSystem {
  constructor() {
    this.isReady = false;
    this.user = null;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Todo Save System...');
      
      // Check if user is logged in
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      
      if (!user) {
        console.error('❌ No user logged in - todo system disabled');
        return false;
      }

      this.user = user;
      this.isReady = true;
      
      console.log('✅ Todo system ready for user:', user.email);
      return true;
      
    } catch (error) {
      console.error('❌ Todo system initialization failed:', error);
      return false;
    }
  }

  async saveTodo(title, description = '', isCompleted = false, category = 'general', priority = 1, dueDate = null) {
    if (!this.isReady) {
      console.error('❌ Todo system not ready');
      return { success: false, error: 'System not initialized' };
    }

    try {
      console.log('💾 Saving todo:', { title, description, isCompleted, category, priority });
      
      const { data, error } = await window.supabaseClient
        .from('user_todos')
        .insert({
          user_id: this.user.id,
          title: title,
          description: description,
          is_completed: isCompleted,
          category: category,
          priority: priority,
          due_date: dueDate,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('❌ Todo save failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Todo saved successfully:', data);
      return { success: true, data: data[0] };
      
    } catch (error) {
      console.error('❌ Todo save error:', error);
      return { success: false, error: error.message };
    }
  }

  async loadTodos() {
    if (!this.isReady) {
      console.error('❌ Todo system not ready');
      return { success: false, error: 'System not initialized', todos: [] };
    }

    try {
      console.log('📂 Loading todos...');
      
      const { data, error } = await window.supabaseClient
        .from('user_todos')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Todo load failed:', error);
        return { success: false, error: error.message, todos: [] };
      }

      console.log('✅ Loaded', data.length, 'todos');
      return { success: true, todos: data };
      
    } catch (error) {
      console.error('❌ Todo load error:', error);
      return { success: false, error: error.message, todos: [] };
    }
  }

  async updateTodo(todoId, updates) {
    if (!this.isReady) {
      console.error('❌ Todo system not ready');
      return { success: false, error: 'System not initialized' };
    }

    try {
      console.log('🔄 Updating todo:', todoId, updates);
      
      const { data, error } = await window.supabaseClient
        .from('user_todos')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', this.user.id)
        .eq('id', todoId)
        .select();

      if (error) {
        console.error('❌ Todo update failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Todo updated successfully:', data);
      return { success: true, data: data[0] };
      
    } catch (error) {
      console.error('❌ Todo update error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTodo(todoId) {
    if (!this.isReady) {
      console.error('❌ Todo system not ready');
      return { success: false, error: 'System not initialized' };
    }

    try {
      console.log('🗑️ Deleting todo:', todoId);
      
      const { error } = await window.supabaseClient
        .from('user_todos')
        .delete()
        .eq('user_id', this.user.id)
        .eq('id', todoId);

      if (error) {
        console.error('❌ Todo delete failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Todo deleted successfully');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Todo delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleTodoStatus(todoId, currentStatus) {
    return await this.updateTodo(todoId, { is_completed: !currentStatus });
  }

  async testSystem() {
    console.log('🧪 Testing todo system...');
    
    // Test 1: Save
    const testTitle = 'Test Todo ' + Date.now();
    const saveResult = await this.saveTodo(testTitle, 'Test description', false, 'test');
    
    if (!saveResult.success) {
      return { success: false, error: 'Save test failed: ' + saveResult.error };
    }

    // Test 2: Load
    const loadResult = await this.loadTodos();
    
    if (!loadResult.success) {
      return { success: false, error: 'Load test failed: ' + loadResult.error };
    }

    // Test 3: Verify
    const found = loadResult.todos.find(todo => todo.title === testTitle);
    if (!found) {
      return { success: false, error: 'Todo not found after save' };
    }

    // Test 4: Update
    const updateResult = await this.updateTodo(found.id, { is_completed: true });
    if (!updateResult.success) {
      return { success: false, error: 'Update test failed: ' + updateResult.error };
    }

    // Test 5: Delete
    const deleteResult = await this.deleteTodo(found.id);
    if (!deleteResult.success) {
      return { success: false, error: 'Delete test failed: ' + deleteResult.error };
    }

    console.log('✅ All todo tests passed');
    return { success: true, message: 'Todo system working correctly' };
  }
}

// Initialize global todo save system
window.todoSaveSystem = new TodoSaveSystem();
