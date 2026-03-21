-- =============================================
-- Migração: Novos campos para Formação
-- =============================================

-- 1. Adicionar link do Meet aos slots
ALTER TABLE formacao_slots ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- 2. Adicionar status "desmarcado" ao check constraint
ALTER TABLE formacao_slots DROP CONSTRAINT IF EXISTS formacao_slots_status_check;
ALTER TABLE formacao_slots ADD CONSTRAINT formacao_slots_status_check
  CHECK (status IN ('pendente', 'conduzido', 'nao_conduzido', 'cancelado', 'desmarcado'));

-- 3. Adicionar descrição às atividades
ALTER TABLE certificado_atividades ADD COLUMN IF NOT EXISTS descricao TEXT;

-- 4. Toggle de visibilidade dos grupos síncronos na página pública
ALTER TABLE formacao_cronograma ADD COLUMN IF NOT EXISTS grupos_visiveis BOOLEAN DEFAULT true;

-- 5. Duração padrão dos grupos síncronos (minutos)
ALTER TABLE formacao_cronograma ADD COLUMN IF NOT EXISTS duracao_minutos INTEGER DEFAULT 90;

-- Se já existia com 120, atualizar para 90
UPDATE formacao_cronograma SET duracao_minutos = 90 WHERE duracao_minutos = 120 OR duracao_minutos IS NULL;
