-- ============================================================
-- AvaliAllos — Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor (Painel > SQL Editor)
-- ============================================================

-- Tabela de avaliadores
CREATE TABLE avaliadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de disponibilidades (slots de 1h por avaliador)
CREATE TABLE disponibilidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  avaliador_id UUID NOT NULL REFERENCES avaliadores(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(avaliador_id, data, horario_inicio)
);
CREATE INDEX idx_disponibilidades_data ON disponibilidades(data);

-- Tabela de agendamentos
-- Cada slot suporta até 2 participantes (roleplay em dupla)
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  nome_completo TEXT NOT NULL,
  telefone TEXT NOT NULL,
  participou_grupo_pratica BOOLEAN NOT NULL DEFAULT false,
  categoria TEXT NOT NULL,
  categoria_outro TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'aprovado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- ============================================================
-- Row Level Security (permissivo para anon key)
-- ============================================================
ALTER TABLE avaliadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on avaliadores"    ON avaliadores    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on disponibilidades" ON disponibilidades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on agendamentos"   ON agendamentos   FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- View: slots disponíveis com contagens de avaliadores E agendamentos
-- ============================================================
CREATE OR REPLACE VIEW slots_disponiveis AS
SELECT
  d.data,
  d.horario_inicio,
  COUNT(DISTINCT d.avaliador_id)                         AS total_avaliadores,
  ARRAY_AGG(DISTINCT a.nome ORDER BY a.nome)             AS nomes_avaliadores,
  COUNT(CASE
    WHEN ag.status != 'cancelado' THEN 1
    ELSE NULL
  END)                                                   AS total_agendamentos,
  COUNT(CASE
    WHEN ag.status != 'cancelado' THEN 1
    ELSE NULL
  END) >= 2                                              AS cheio
FROM disponibilidades d
JOIN avaliadores a ON a.id = d.avaliador_id
LEFT JOIN agendamentos ag
  ON ag.data = d.data
  AND ag.horario_inicio = d.horario_inicio
GROUP BY d.data, d.horario_inicio;

-- ============================================================
-- View: agendamentos detalhados para admin
-- ============================================================
CREATE OR REPLACE VIEW agendamentos_detalhados AS
SELECT
  ag.*,
  sd.total_avaliadores,
  sd.nomes_avaliadores
FROM agendamentos ag
LEFT JOIN slots_disponiveis sd
  ON sd.data = ag.data
  AND sd.horario_inicio = ag.horario_inicio
ORDER BY ag.created_at DESC;
