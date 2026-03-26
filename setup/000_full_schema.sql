-- ============================================================
-- ALLOS-SITE — Schema Completo para Novo Supabase
-- Gerado em 2026-03-25
-- Cole TUDO no SQL Editor do novo projeto Supabase e clique Run
-- ============================================================

-- ============================================================
-- 1. TABELAS — AvaliAllos (Sistema de Avaliação)
-- ============================================================

-- Slots avulsos (data específica)
CREATE TABLE IF NOT EXISTS slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora TEXT NOT NULL,
  max_avaliadores INT NOT NULL DEFAULT 2,
  max_avaliados INT NOT NULL DEFAULT 2,
  ativo BOOLEAN DEFAULT true,
  no_formulario BOOLEAN DEFAULT false,
  criado_por TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Slots fixos (recorrentes semanais)
CREATE TABLE IF NOT EXISTS slots_fixos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana TEXT NOT NULL,
  hora TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Avaliadores
CREATE TABLE IF NOT EXISTS avaliadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  capacidade_semanal INT DEFAULT 3,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Disponibilidade avaliador em slots avulsos
CREATE TABLE IF NOT EXISTS avaliador_disponibilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID REFERENCES avaliadores(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES slots(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(avaliador_id, slot_id)
);

-- Disponibilidade avaliador em slots fixos
CREATE TABLE IF NOT EXISTS avaliador_disp_fixo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID REFERENCES avaliadores(id) ON DELETE CASCADE,
  slot_fixo_id UUID REFERENCES slots_fixos(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(avaliador_id, slot_fixo_id)
);

-- Avaliados (fila de avaliação)
CREATE TABLE IF NOT EXISTS avaliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  telefone TEXT NOT NULL,
  ja_participou BOOLEAN DEFAULT false,
  categoria TEXT NOT NULL,
  observacoes TEXT,
  status TEXT DEFAULT 'aguardando',
  slot_preferencia TEXT,
  fixos_escolhidos TEXT DEFAULT '[]',
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Bookings (avaliado alocado em slot)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliado_id UUID REFERENCES avaliados(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES slots(id) ON DELETE CASCADE,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Avaliações (fichas de avaliação)
CREATE TABLE IF NOT EXISTS avaliacoes (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL DEFAULT current_date,
  avaliador_id UUID REFERENCES avaliadores(id) ON DELETE SET NULL,
  avaliado_id UUID REFERENCES avaliados(id) ON DELETE SET NULL,
  nome_sessao TEXT NOT NULL,
  estagio_mudanca INT DEFAULT 0,
  estrutura_coerencia INT DEFAULT 0,
  encerramento_abertura INT DEFAULT 0,
  acolhimento INT DEFAULT 0,
  seguranca_terapeuta INT DEFAULT 0,
  seguranca_metodo INT DEFAULT 0,
  aprofundamento INT DEFAULT 0,
  hipoteses INT DEFAULT 0,
  interpretacao INT DEFAULT 0,
  frase_timing INT DEFAULT 0,
  corpo_setting INT DEFAULT 0,
  insight_potencia INT DEFAULT 0,
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Quadro semanal
CREATE TABLE IF NOT EXISTS quadro_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(data, hora)
);

CREATE TABLE IF NOT EXISTS quadro_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadro_slot_id UUID REFERENCES quadro_slots(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  confirmado BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Mensagens WhatsApp
CREATE TABLE IF NOT EXISTS mensagens_whatsapp (
  id SERIAL PRIMARY KEY,
  tipo TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  template TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. TABELAS — Certificados e Formação
-- ============================================================

-- Atividades
CREATE TABLE IF NOT EXISTS certificado_atividades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  carga_horaria INTEGER DEFAULT 2,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Condutores
CREATE TABLE IF NOT EXISTS certificado_condutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Submissions
CREATE TABLE IF NOT EXISTS certificado_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  nome_social TEXT,
  email TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  nota_grupo INTEGER DEFAULT 0 CHECK (nota_grupo >= 0 AND nota_grupo <= 10),
  condutores TEXT[] DEFAULT '{}',
  nota_condutor INTEGER DEFAULT 0 CHECK (nota_condutor >= 0 AND nota_condutor <= 10),
  relato TEXT,
  certificado_gerado BOOLEAN DEFAULT false,
  certificado_resgatado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Eventos temporários
CREATE TABLE IF NOT EXISTS certificado_eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Horários da formação
CREATE TABLE IF NOT EXISTS formacao_horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hora TEXT NOT NULL UNIQUE,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Slots da formação (dia x horário)
CREATE TABLE IF NOT EXISTS formacao_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 4),
  horario_id UUID NOT NULL REFERENCES formacao_horarios(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT true,
  atividade_nome TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','conduzido','nao_conduzido','cancelado','desmarcado')),
  meet_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dia_semana, horario_id)
);

-- Alocações de condutores
CREATE TABLE IF NOT EXISTS formacao_alocacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID NOT NULL REFERENCES formacao_slots(id) ON DELETE CASCADE,
  condutor_id UUID NOT NULL REFERENCES certificado_condutores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slot_id, condutor_id)
);

-- Cronograma (singleton)
CREATE TABLE IF NOT EXISTS formacao_cronograma (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imagem_base64 TEXT,
  grupos_visiveis BOOLEAN DEFAULT true,
  duracao_minutos INTEGER DEFAULT 90,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. TABELAS — Painel (Marketing/Vendas)
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

-- Views
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

-- ============================================================
-- 4. TRIGGER — Limite de avaliadores por slot
-- ============================================================

CREATE OR REPLACE FUNCTION enforce_max_avaliadores()
RETURNS TRIGGER AS $$
DECLARE cnt INT; max_val INT;
BEGIN
  SELECT count(*) INTO cnt FROM avaliador_disponibilidade WHERE slot_id = NEW.slot_id;
  SELECT max_avaliadores INTO max_val FROM slots WHERE id = NEW.slot_id;
  IF cnt >= max_val THEN
    RAISE EXCEPTION 'Limite de avaliadores atingido para este horário';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_max_avaliadores
BEFORE INSERT ON avaliador_disponibilidade
FOR EACH ROW EXECUTE FUNCTION enforce_max_avaliadores();

-- ============================================================
-- 5. ROW LEVEL SECURITY — Habilitar em todas as tabelas
-- ============================================================

ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots_fixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliador_disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliador_disp_fixo ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quadro_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE quadro_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_condutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificado_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_alocacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE formacao_cronograma ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES — Acesso aberto (admin via service role key)
-- ============================================================

-- AvaliAllos
CREATE POLICY "slots_sel" ON slots FOR SELECT USING (true);
CREATE POLICY "slots_all" ON slots FOR ALL USING (true);

CREATE POLICY "fixos_sel" ON slots_fixos FOR SELECT USING (true);
CREATE POLICY "fixos_all" ON slots_fixos FOR ALL USING (true);

CREATE POLICY "avaliadores_sel" ON avaliadores FOR SELECT USING (true);
CREATE POLICY "avaliadores_all" ON avaliadores FOR ALL USING (true);

CREATE POLICY "disp_sel" ON avaliador_disponibilidade FOR SELECT USING (true);
CREATE POLICY "disp_all" ON avaliador_disponibilidade FOR ALL USING (true);

CREATE POLICY "disp_fixo_sel" ON avaliador_disp_fixo FOR SELECT USING (true);
CREATE POLICY "disp_fixo_all" ON avaliador_disp_fixo FOR ALL USING (true);

CREATE POLICY "avaliados_sel" ON avaliados FOR SELECT USING (true);
CREATE POLICY "avaliados_all" ON avaliados FOR ALL USING (true);

CREATE POLICY "bookings_sel" ON bookings FOR SELECT USING (true);
CREATE POLICY "bookings_all" ON bookings FOR ALL USING (true);

CREATE POLICY "aval_sel" ON avaliacoes FOR SELECT USING (true);
CREATE POLICY "aval_all" ON avaliacoes FOR ALL USING (true);

CREATE POLICY "qs_sel" ON quadro_slots FOR SELECT USING (true);
CREATE POLICY "qs_all" ON quadro_slots FOR ALL USING (true);

CREATE POLICY "qp_sel" ON quadro_participantes FOR SELECT USING (true);
CREATE POLICY "qp_all" ON quadro_participantes FOR ALL USING (true);

CREATE POLICY "msgs_sel" ON mensagens_whatsapp FOR SELECT USING (true);
CREATE POLICY "msgs_all" ON mensagens_whatsapp FOR ALL USING (true);

-- Certificados e Formação
CREATE POLICY "cert_ativ_sel" ON certificado_atividades FOR SELECT USING (true);
CREATE POLICY "cert_ativ_all" ON certificado_atividades FOR ALL USING (true);

CREATE POLICY "cert_cond_sel" ON certificado_condutores FOR SELECT USING (true);
CREATE POLICY "cert_cond_all" ON certificado_condutores FOR ALL USING (true);

CREATE POLICY "cert_sub_sel" ON certificado_submissions FOR SELECT USING (true);
CREATE POLICY "cert_sub_all" ON certificado_submissions FOR ALL USING (true);

CREATE POLICY "cert_ev_sel" ON certificado_eventos FOR SELECT USING (true);
CREATE POLICY "cert_ev_all" ON certificado_eventos FOR ALL USING (true);

CREATE POLICY "form_hor_sel" ON formacao_horarios FOR SELECT USING (true);
CREATE POLICY "form_hor_all" ON formacao_horarios FOR ALL USING (true);

CREATE POLICY "form_slot_sel" ON formacao_slots FOR SELECT USING (true);
CREATE POLICY "form_slot_all" ON formacao_slots FOR ALL USING (true);

CREATE POLICY "form_aloc_sel" ON formacao_alocacoes FOR SELECT USING (true);
CREATE POLICY "form_aloc_all" ON formacao_alocacoes FOR ALL USING (true);

CREATE POLICY "form_cron_sel" ON formacao_cronograma FOR SELECT USING (true);
CREATE POLICY "form_cron_all" ON formacao_cronograma FOR ALL USING (true);

-- Painel
CREATE POLICY "campaigns_sel" ON campaigns FOR SELECT USING (true);
CREATE POLICY "campaigns_all" ON campaigns FOR ALL USING (true);

CREATE POLICY "links_sel" ON links FOR SELECT USING (true);
CREATE POLICY "links_all" ON links FOR ALL USING (true);

CREATE POLICY "clicks_sel" ON clicks FOR SELECT USING (true);
CREATE POLICY "clicks_all" ON clicks FOR ALL USING (true);

CREATE POLICY "templates_sel" ON sales_templates FOR SELECT USING (true);
CREATE POLICY "templates_all" ON sales_templates FOR ALL USING (true);

CREATE POLICY "leads_sel" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_all" ON leads FOR ALL USING (true);

-- ============================================================
-- 7. REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes;
ALTER PUBLICATION supabase_realtime ADD TABLE slots_fixos;
ALTER PUBLICATION supabase_realtime ADD TABLE avaliador_disp_fixo;

-- ============================================================
-- 8. SEED DATA
-- ============================================================

-- Mensagens WhatsApp padrão
INSERT INTO mensagens_whatsapp (tipo, titulo, template) VALUES
  ('confirmacao', 'Confirmação de avaliação',
   'Olá {nome}! Você foi selecionado(a) para avaliação na Associação Allos no dia {data} às {hora}. Por favor, confirme sua presença respondendo esta mensagem.'),
  ('cobranca', 'Aguardando resposta',
   'Olá {nome}, ainda estamos aguardando sua confirmação para a avaliação do dia {data} às {hora}. Caso não responda em 1 dia, sua vaga será liberada.'),
  ('remocao', 'Remoção da lista',
   'Olá {nome}, informamos que seu nome foi removido da lista de avaliação. Para se registrar novamente, acesse: {link}')
ON CONFLICT (tipo) DO NOTHING;

-- Horários padrão da formação
INSERT INTO formacao_horarios (hora, ordem) VALUES
  ('14:00', 1), ('16:00', 2), ('19:00', 3)
ON CONFLICT (hora) DO NOTHING;

-- Cronograma singleton
INSERT INTO formacao_cronograma (grupos_visiveis, duracao_minutos) VALUES (true, 90);

-- Templates de vendas
INSERT INTO sales_templates (flow, stage, template_key, title, body, sort_order, is_objection) VALUES
('terapia', 'abertura', 'boas_vindas', 'Boas-vindas',
 E'Olá! Que alegria te ter aqui! 🩵\nMe chamo {vendedor} e faço parte da coordenação da clínica da Allos.\n\nO nosso propósito é unir ensino de qualidade para a formação dos terapeutas e ofertar um serviço de qualidade para vocês!\n\nAo optar pela ALLOS você está colaborando para a formação contínua dos terapeutas e recebendo terapia acessível de altíssima qualidade!',
 0, false),
('terapia', 'abertura', 'transicao', 'Transição',
 'Faz sentido pra você?', 1, false),
('terapia', 'planos', 'apresentacao', 'Apresentação dos planos',
 E'Que bom, {nome}!\n\nNós oferecemos 2 pacotes de terapia:\n\n1️⃣ Clínica Allos / R$200 por mês\n✔️ Sessões semanais com terapeutas excelentes\n\n2️⃣ Clínica Allos PRO / R$450 por mês\n✔️ Sessões semanais com terapeutas excelentes\n✔️ Cuidado extendido à família\n✔️ Oferecemos avaliação psicológica sem custo adicional, caso seja necessário\n\nQual dessas opções atende melhor suas necessidades hoje? ✨',
 0, false),
('terapia', 'coleta', 'pedido', 'Coleta de informações',
 E'Perfeito! Para encontrarmos o terapeuta ideal e conciliarmos as agendas, preciso de algumas informações iniciais:\n\n- Nome completo:\n- Horários disponíveis para terapia: (Manhã/Tarde/Noite? Quais dias?)\n- Existe alguma preferência de abordagem (ex: TCC, Psicanálise) ou algo que gostaria de focar na terapia?',
 0, false),
('terapia', 'oferta', 'confirmacao', 'Confirmação de vaga',
 E'Olá, {nome}! Boas notícias! 🩵\nConseguimos uma vaga para você!\nA vaga é para {dia} às {horario}, iniciando no dia {data_inicio}.\n\nEste horário funciona para você? ✨',
 0, false),
('terapia', 'oferta', 'horario_nao_serve', 'Horário não serve',
 'Sem problemas! Vamos buscar outra opção. Quais outros horários seriam possíveis?', 1, false),
('terapia', 'pagamento', 'coleta_dados', 'Coleta de dados para pagamento',
 E'Ótimo! Para finalizarmos, preciso de mais alguns dados:\n\nData de nascimento:\nEndereço completo + CEP:\nNúmero para contato de apoio:\n\n(Digite apenas números, sem pontos ou traços)',
 0, false),
('terapia', 'pagamento', 'instrucao', 'Instrução de pagamento',
 E'Para garantirmos o início da sua terapia no dia {data_inicio}, solicitamos o pagamento da entrada ao plano.\n\nEsse pagamento é proporcional aos dias que o plano será utilizado neste mês.\nA próxima mensalidade cheia será no dia 01 do próximo mês.\n\nO valor da sua entrada será: R${valor_entrada}',
 1, false),
('terapia', 'pagamento', 'garantia', 'Garantia de satisfação',
 E'**Seu investimento está 100% protegido** 🛡️\n\nComo funciona o pagamento inicial?\nNa entrada, você paga apenas pelo período restante até o próximo mês. Simples e justo!\n\n**Garantia de satisfação**\nSe você não gostar do tratamento, devolvemos seu investimento inicial.\n\n**Liberdade de escolha**\nNossa equipe conta com vários profissionais e diferentes abordagens terapêuticas (psicanálise, TCC, humanista, etc.)\n\n🔄 Não se identificou com seu terapeuta?\nSem problema! Você pode trocar, sem custo adicional.',
 2, false),
('terapia', 'finalizacao', 'encaminhamento', 'Encaminhamento pós-venda',
 E'Vou te encaminhar e em breve entrarão em contato com você para agendar sua primeira sessão!\n\nPara garantirmos o melhor serviço para vocês, aviso que após a primeira sessão a Juliana irá entrar em contato para saber como foi sua experiência 🩵',
 0, false),
('terapia', 'objecoes', 'por_que_estudantes', 'Por que estudantes?',
 E'Temos estudantes e formados! 💛\nNós os avaliamos de forma igualitária através de um rigoroso processo seletivo no qual avaliamos o nível de aprofundamento teórico e habilidades clínicas. Hoje, apenas 5% dos nossos candidatos são aprovados, e muitos que já são formados não passam pois a formação de sua faculdade não os proporcionou expertise clínica.\n\nNossa nota de corte é alta, a supervisão semanal com profissionais formados e experientes é obrigatória além da participação dos terapeutas em nossos grupos de estudo semanais. ✨',
 0, true),
('terapia', 'objecoes', 'como_funciona', 'Como terapia funciona?',
 E'A terapia é um momento 100% seu! Um tempo para desabafar e se conhecer melhor sem julgamentos. Nossa prioridade é te oferecer tudo isso com uma terapia de qualidade!\n\nComo funciona o atendimento?\n• É online: Você pode fazer pelo seu celular ou computador.\n• Duração: É UMA HORA de cuidado reservado só para você.\n• Semanal: Uma vez na semana você terá sua sessão garantida. E se alguma emergência acontecer, a gente consegue te atender mais vezes. 🆘\n\nPor que um valor por mês? Essa mensalidade é o que garante que seu atendimento seja contínuo. A terapia funciona de verdade quando mantemos a frequência.\n\n🔄 Você pode trocar de terapeuta quantas vezes quiser. O importante é você achar alguém que te deixe 100% à vontade!\n\nÉ essa constância que ajuda você a criar um laço de confiança e a sentir a mudança boa na sua vida. 🦋',
 1, true),
('terapia', 'objecoes', 'valor_entrada', 'Por que tem valor de entrada?',
 E'A forma como funcionamos para iniciar o plano é a seguinte: nós precisamos do pagamento proporcional da mensalidade para confirmar o agendamento da sua primeira sessão.\n\nPorém, queremos que você se sinta segura com essa escolha. Por isso, caso você realize essa primeira consulta e sinta que não houve a afinidade que buscava ou não queira continuar por qualquer motivo, você pode solicitar o reembolso integral desse valor de entrada.\n\nAssim, você pode ter essa primeira sessão para conhecer a terapeuta com total tranquilidade. Podemos seguir com o agendamento?',
 2, true),
('terapia', 'objecoes', 'objecao_valor', 'Está caro / Não tenho condições',
 E'💙 Nossa mensalidade: R$ 200/mês\n✓ Sessões semanais garantidas\n✓ Mensalidade fixa para 4 ou 5 sessões\n\n📊 Vamos fazer as contas?\nO valor tradicional de mercado varia entre R$ 180 a R$ 250 por sessão, ou seja, em meses com cinco semanas a mensalidade chegaria a R$ 1.250 💸.\n\nNós ofertamos uma economia real de mais de 80%!\n\n✨ Por que a continuidade importa?\n\nTerapia funciona com constância. Interromper o tratamento prejudica sua evolução.\nNossa mensalidade foi criada para:\n✓ Garantir seu tratamento sem interrupções\n✓ Dar previsibilidade ao seu orçamento\n✓ Tornar a terapia sustentável a longo prazo\n\nPor menos de R$ 7 por dia, você cuida da sua saúde mental com qualidade e sem preocupações 💚',
 3, true),
('terapia', 'objecoes', 'preciso_pensar', 'Preciso pensar',
 E'Claro, {nome}! É totalmente compreensível querer pensar. 🩵\n\nSó quero reforçar que as vagas com os terapeutas são limitadas e os horários mais procurados costumam preencher rápido.\n\nLembrando que você tem a garantia de satisfação: se não gostar da primeira sessão, devolvemos 100% do valor da entrada.\n\nPosso reservar essa vaga por hoje para você? Assim você tem a segurança de que o horário estará disponível quando decidir. 😊',
 4, true),
('avaliacao_neuro', 'abertura', 'boas_vindas', 'Boas-vindas',
 E'Olá! Que bom ter você aqui! 🩵\nMe chamo {vendedor} e faço parte da coordenação da Allos.\n\nVi que você tem interesse na Avaliação Neuropsicológica. Vou te explicar como funciona o nosso processo e tirar todas as suas dúvidas!',
 0, false),
('avaliacao_neuro', 'triagem', 'perguntas', 'Perguntas de triagem',
 E'Para entendermos melhor a sua necessidade e direcionarmos da melhor forma, preciso de algumas informações:\n\n- Nome completo do paciente:\n- Idade:\n- Quem fez o encaminhamento? (neurologista, psiquiatra, escola...)\n- Qual a principal queixa ou motivo da avaliação?\n- Possui algum laudo ou relatório anterior?',
 0, false),
('avaliacao_neuro', 'apresentacao', 'servico', 'O que é a avaliação',
 E'A Avaliação Neuropsicológica é um processo técnico que mapeia o funcionamento cognitivo — atenção, memória, funções executivas, linguagem, entre outros.\n\nNa Allos, a avaliação inclui:\n✔️ Entrevista clínica inicial (anamnese)\n✔️ Sessões de testagem (conforme complexidade do caso)\n✔️ Correção e análise dos resultados\n✔️ Elaboração de laudo técnico detalhado\n✔️ Sessão de devolutiva com o paciente/família\n\nDuração total estimada: 2 a 4 semanas 📋',
 0, false),
('avaliacao_neuro', 'proposta', 'introducao', 'Proposta financeira',
 E'Agora vou te apresentar as condições de pagamento:\n\nValor da avaliação: R${valor_total}\n\n{opcoes_pagamento}\n\nQual forma de pagamento é melhor para você?',
 0, false),
('avaliacao_neuro', 'proposta', 'pix', 'Pagamento via Pix',
 E'💰 Pix à vista: R${valor_pix} ({desconto}% de desconto)\nChave Pix: {pix_chave}\nTitular: {pix_nome}',
 1, false),
('avaliacao_neuro', 'proposta', 'stripe', 'Pagamento via cartão',
 E'💳 Cartão de crédito: até {max_parcelas}x de R${valor_parcela}',
 2, false),
('avaliacao_neuro', 'agendamento', 'pos_pagamento', 'Pós-pagamento',
 E'Pagamento confirmado! ✅\n\nAgora vamos agendar suas sessões:\n\n📅 Sessão 1 — Anamnese (entrevista): {data_anamnese}\n📅 Sessões de testagem: serão agendadas após a anamnese\n📅 Devolutiva: será agendada após a conclusão do laudo\n\nVou te enviar as orientações para a primeira sessão!',
 0, false),
('avaliacao_neuro', 'objecoes', 'quanto_tempo', 'Quanto tempo demora?',
 E'O processo completo de avaliação neuropsicológica leva em média de 2 a 4 semanas, dependendo da complexidade do caso.\n\nIsso inclui:\n• 1 sessão de anamnese (entrevista)\n• 2 a 4 sessões de testagem\n• Período de correção e elaboração do laudo\n• 1 sessão de devolutiva\n\nNós priorizamos a qualidade e a profundidade da avaliação para que o laudo seja realmente útil para o tratamento. 📋',
 0, true),
('avaliacao_neuro', 'objecoes', 'convenio', 'Meu convênio cobre?',
 E'Atualmente trabalhamos com pagamento particular. No entanto, nosso laudo técnico segue todos os padrões exigidos e pode ser utilizado para solicitar reembolso junto ao seu plano de saúde.\n\nAlém disso, oferecemos parcelamento em até 5x no cartão para facilitar. 💳',
 1, true),
('avaliacao_neuro', 'objecoes', 'diferenca_avaliacao', 'Psicológica vs neuropsicológica',
 E'Ótima pergunta! São complementares, mas diferentes:\n\n🧠 Avaliação Neuropsicológica:\nFoca no funcionamento cognitivo — atenção, memória, funções executivas, linguagem, velocidade de processamento. Usa testes padronizados e normatizados. Resulta em um perfil cognitivo detalhado.\n\n💭 Avaliação Psicológica:\nFoca em aspectos emocionais, personalidade, comportamento e dinâmica relacional. Usa testes projetivos e de personalidade.\n\nA neuropsicológica é especialmente indicada quando há queixas de TDAH, dificuldades de aprendizagem, declínio cognitivo, ou para subsidiar diagnósticos neurológicos/psiquiátricos.',
 2, true),
('avaliacao_neuro', 'objecoes', 'valor_alto', 'O valor é alto',
 E'Entendo sua preocupação, {nome}. 🩵\n\nA Avaliação Neuropsicológica é um processo especializado que envolve:\n• Profissional qualificado com formação específica\n• Bateria de testes padronizados (materiais com custo elevado)\n• Horas de aplicação, correção e análise\n• Laudo técnico detalhado\n\nNo mercado, avaliações neuropsicológicas costumam variar de R$ 2.000 a R$ 4.000.\n\nAlém disso, oferecemos:\n💰 Desconto para pagamento à vista via Pix\n💳 Parcelamento em até 5x no cartão\n\nE o laudo pode ser usado para reembolso do plano de saúde!',
 3, true)
ON CONFLICT (flow, stage, template_key) DO NOTHING;
