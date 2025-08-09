-- ==========================================
-- TODO LIST FUNCTIONALITY - MISSING TABLES
-- ==========================================

-- User todo items table
CREATE TABLE IF NOT EXISTS user_todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    category VARCHAR(50) DEFAULT 'general',
    priority INTEGER DEFAULT 1,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for todo table
CREATE INDEX IF NOT EXISTS idx_user_todos_user_id ON user_todos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_todos_completed ON user_todos(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_todos_created_at ON user_todos(created_at DESC);

-- Row Level Security (RLS) Policies for todos
ALTER TABLE user_todos ENABLE ROW LEVEL SECURITY;

-- Policies for user_todos
CREATE POLICY "Users can view own todos" ON user_todos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON user_todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON user_todos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON user_todos
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_todos_updated_at 
    BEFORE UPDATE ON user_todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
