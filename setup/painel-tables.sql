-- ============================================================
-- PAINEL ALLOS LINK — Tabelas Supabase
-- Cole este SQL no Supabase SQL Editor para criar as tabelas
-- ============================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  channel VARCHAR(100) NOT NULL,
  strategy TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  campaign_id INTEGER REFERENCES campaigns(id),
  wa_message TEXT NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS clicks (
  id SERIAL PRIMARY KEY,
  link_id INTEGER REFERENCES links(id),
  clicked_at TIMESTAMP DEFAULT NOW(),
  device_type VARCHAR(20),
  user_agent TEXT,
  referer VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS sales_templates (
  id SERIAL PRIMARY KEY,
  flow VARCHAR(50) NOT NULL,
  stage VARCHAR(100) NOT NULL,
  template_key VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_objection BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(flow, stage, template_key)
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  campaign_id INTEGER REFERENCES campaigns(id),
  stage VARCHAR(30) NOT NULL DEFAULT 'novo',
  flow VARCHAR(30) NOT NULL DEFAULT 'terapia',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Views para consultas complexas (usadas pelas API routes)

CREATE OR REPLACE VIEW links_with_stats AS
SELECT l.*, c.name AS campaign_name, c.channel AS campaign_channel, c.strategy AS campaign_strategy,
  (SELECT COUNT(*) FROM clicks WHERE link_id = l.id) AS total_clicks,
  (SELECT MAX(clicked_at) FROM clicks WHERE link_id = l.id) AS last_click
FROM links l
LEFT JOIN campaigns c ON l.campaign_id = c.id;

CREATE OR REPLACE VIEW campaign_stats AS
SELECT c.*,
  (SELECT COUNT(*) FROM links WHERE campaign_id = c.id AND active = true) AS active_links,
  (SELECT COUNT(*) FROM clicks cl JOIN links l ON cl.link_id = l.id WHERE l.campaign_id = c.id) AS total_clicks
FROM campaigns c;
