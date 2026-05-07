-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  profile_image_url TEXT,
  trust_score INTEGER DEFAULT 50,
  is_official INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT,
  content TEXT, -- 상세 후기 (텍스트)
  review TEXT, -- 한줄 평
  rating REAL,
  images TEXT, -- JSON array string
  tags TEXT, -- JSON array string (keywords)
  editor_mode TEXT DEFAULT 'simple', -- 'simple' or 'story'
  story_blocks TEXT, -- JSON array string for story mode blocks
  menu_items TEXT, -- JSON array string for recommended menus
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES users(id)
);

-- Themes Table
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  keywords TEXT, -- JSON array string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES users(id)
);

-- Theme Posts Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS theme_posts (
  theme_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (theme_id, post_id),
  FOREIGN KEY (theme_id) REFERENCES themes(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Follows Table
CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id)
);

-- Bookmarks Table (Wishlist)
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- User Custom Maps (Categories)
CREATE TABLE IF NOT EXISTS user_maps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User Map Items (Posts in categories)
CREATE TABLE IF NOT EXISTS user_map_items (
  map_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (map_id, post_id),
  FOREIGN KEY (map_id) REFERENCES user_maps(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
