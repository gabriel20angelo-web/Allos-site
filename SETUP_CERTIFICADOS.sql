-- =============================================================
-- Alos Certificados & Feedback — Supabase Schema
-- =============================================================

-- 1. Atividades (activities that can be selected in the form)
CREATE TABLE cert_atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

INSERT INTO cert_atividades (nome) VALUES
  ('Prática Clínica'),
  ('Aprimoramento Clínico'),
  ('Mesa de Estudos'),
  ('Duelo de Abordagem');

-- 2. Condutores (group conductors)
CREATE TABLE cert_condutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

INSERT INTO cert_condutores (nome) VALUES
  ('Rodolfo'), ('Gabriel'), ('Ângelo'), ('Arthur'),
  ('Bernardo'), ('Tainá'), ('Giúlia'), ('Cindy'),
  ('Adrian'), ('Ariane'), ('Alice Cheche'), ('Tássia'),
  ('Alan'), ('Beatriz'), ('Alice');

-- 3. Submissions (form entries with feedback)
CREATE TABLE cert_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  nome_social TEXT,
  email TEXT NOT NULL,
  atividade_id UUID REFERENCES cert_atividades(id),
  atividade_nome TEXT NOT NULL,
  nota_grupo INT CHECK (nota_grupo BETWEEN 1 AND 5),
  condutores_ids UUID[] DEFAULT '{}',
  condutores_nomes TEXT[] DEFAULT '{}',
  nota_condutor INT CHECK (nota_condutor BETWEEN 1 AND 5),
  relato TEXT,
  ip_hash TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- 4. Certificates (generated certificates with abuse control)
CREATE TABLE cert_certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES cert_submissions(id),
  nome_participante TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  data_participacao DATE NOT NULL DEFAULT CURRENT_DATE,
  carga_horaria TEXT DEFAULT '2 horas',
  codigo_verificacao TEXT NOT NULL UNIQUE,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Index for abuse control: max 3 certificates per email per day
CREATE INDEX idx_cert_submissions_email_date ON cert_submissions (email, (criado_em::date));
CREATE INDEX idx_cert_submissions_ip_date ON cert_submissions (ip_hash, (criado_em::date));

-- Index for dashboard queries
CREATE INDEX idx_cert_submissions_criado ON cert_submissions (criado_em);
CREATE INDEX idx_cert_submissions_condutores ON cert_submissions USING GIN (condutores_ids);

-- RLS policies (adjust as needed for your Supabase setup)
ALTER TABLE cert_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cert_condutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cert_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cert_certificados ENABLE ROW LEVEL SECURITY;

-- Public read for atividades and condutores (active only)
CREATE POLICY "Public read active atividades" ON cert_atividades FOR SELECT USING (ativo = true);
CREATE POLICY "Public read active condutores" ON cert_condutores FOR SELECT USING (ativo = true);

-- Public insert for submissions
CREATE POLICY "Public insert submissions" ON cert_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert certificados" ON cert_certificados FOR INSERT WITH CHECK (true);

-- Service role full access (for admin operations via server)
CREATE POLICY "Service full atividades" ON cert_atividades FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full condutores" ON cert_condutores FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full submissions" ON cert_submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full certificados" ON cert_certificados FOR ALL USING (auth.role() = 'service_role');

-- Public read for certificate verification
CREATE POLICY "Public read certificados" ON cert_certificados FOR SELECT USING (true);
