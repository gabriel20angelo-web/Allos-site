-- ============================================================
-- Seed script for the sales_templates table
-- Populates all 26 message templates used by the sales panel,
-- covering the "terapia" and "avaliacao_neuro" flows.
-- Run this after creating the sales_templates table.
-- ============================================================

DELETE FROM sales_templates;

INSERT INTO sales_templates (flow, stage, template_key, title, body, sort_order, is_objection) VALUES
-- === TERAPIA — Abertura ===
('terapia', 'abertura', 'boas_vindas', 'Boas-vindas',
 E'Olá! Que alegria te ter aqui! 🩵\nMe chamo {vendedor} e faço parte da coordenação da clínica da Allos.\n\nO nosso propósito é unir ensino de qualidade para a formação dos terapeutas e ofertar um serviço de qualidade para vocês!\n\nAo optar pela ALLOS você está colaborando para a formação contínua dos terapeutas e recebendo terapia acessível de altíssima qualidade!',
 0, false),

('terapia', 'abertura', 'transicao', 'Transição',
 'Faz sentido pra você?',
 1, false),

-- === TERAPIA — Planos ===
('terapia', 'planos', 'apresentacao', 'Apresentação dos planos',
 E'Que bom, {nome}!\n\nNós oferecemos 2 pacotes de terapia:\n\n1️⃣ Clínica Allos / R$200 por mês\n✔️ Sessões semanais com terapeutas excelentes\n\n2️⃣ Clínica Allos PRO / R$450 por mês\n✔️ Sessões semanais com terapeutas excelentes\n✔️ Cuidado extendido à família\n✔️ Oferecemos avaliação psicológica sem custo adicional, caso seja necessário\n\nQual dessas opções atende melhor suas necessidades hoje? ✨',
 0, false),

-- === TERAPIA — Coleta ===
('terapia', 'coleta', 'pedido', 'Coleta de informações',
 E'Perfeito! Para encontrarmos o terapeuta ideal e conciliarmos as agendas, preciso de algumas informações iniciais:\n\n- Nome completo:\n- Horários disponíveis para terapia: (Manhã/Tarde/Noite? Quais dias?)\n- Existe alguma preferência de abordagem (ex: TCC, Psicanálise) ou algo que gostaria de focar na terapia?',
 0, false),

-- === TERAPIA — Oferta ===
('terapia', 'oferta', 'confirmacao', 'Confirmação de vaga',
 E'Olá, {nome}! Boas notícias! 🩵\nConseguimos uma vaga para você!\nA vaga é para {dia} às {horario}, iniciando no dia {data_inicio}.\n\nEste horário funciona para você? ✨',
 0, false),

('terapia', 'oferta', 'horario_nao_serve', 'Horário não serve',
 'Sem problemas! Vamos buscar outra opção. Quais outros horários seriam possíveis?',
 1, false),

-- === TERAPIA — Pagamento ===
('terapia', 'pagamento', 'coleta_dados', 'Coleta de dados para pagamento',
 E'Ótimo! Para finalizarmos, preciso de mais alguns dados:\n\nData de nascimento:\nEndereço completo + CEP:\nNúmero para contato de apoio:\n\n(Digite apenas números, sem pontos ou traços)',
 0, false),

('terapia', 'pagamento', 'instrucao', 'Instrução de pagamento',
 E'Para garantirmos o início da sua terapia no dia {data_inicio}, solicitamos o pagamento da entrada ao plano.\n\nEsse pagamento é proporcional aos dias que o plano será utilizado neste mês.\nA próxima mensalidade cheia será no dia 01 do próximo mês.\n\nO valor da sua entrada será: R${valor_entrada}',
 1, false),

('terapia', 'pagamento', 'garantia', 'Garantia de satisfação',
 E'**Seu investimento está 100% protegido** 🛡️\n\nComo funciona o pagamento inicial?\nNa entrada, você paga apenas pelo período restante até o próximo mês. Simples e justo!\n\n**Garantia de satisfação**\nSe você não gostar do tratamento, devolvemos seu investimento inicial.\n\n**Liberdade de escolha**\nNossa equipe conta com vários profissionais e diferentes abordagens terapêuticas (psicanálise, TCC, humanista, etc.)\n\n🔄 Não se identificou com seu terapeuta?\nSem problema! Você pode trocar, sem custo adicional.',
 2, false),

-- === TERAPIA — Finalização ===
('terapia', 'finalizacao', 'encaminhamento', 'Encaminhamento pós-venda',
 E'Vou te encaminhar e em breve entrarão em contato com você para agendar sua primeira sessão!\n\nPara garantirmos o melhor serviço para vocês, aviso que após a primeira sessão a Juliana irá entrar em contato para saber como foi sua experiência 🩵',
 0, false),

-- === TERAPIA — Objeções ===
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

-- === AVALIAÇÃO NEURO — Abertura ===
('avaliacao_neuro', 'abertura', 'boas_vindas', 'Boas-vindas',
 E'Olá! Que bom ter você aqui! 🩵\nMe chamo {vendedor} e faço parte da coordenação da Allos.\n\nVi que você tem interesse na Avaliação Neuropsicológica. Vou te explicar como funciona o nosso processo e tirar todas as suas dúvidas!',
 0, false),

-- === AVALIAÇÃO NEURO — Triagem ===
('avaliacao_neuro', 'triagem', 'perguntas', 'Perguntas de triagem',
 E'Para entendermos melhor a sua necessidade e direcionarmos da melhor forma, preciso de algumas informações:\n\n- Nome completo do paciente:\n- Idade:\n- Quem fez o encaminhamento? (neurologista, psiquiatra, escola...)\n- Qual a principal queixa ou motivo da avaliação?\n- Possui algum laudo ou relatório anterior?',
 0, false),

-- === AVALIAÇÃO NEURO — Apresentação ===
('avaliacao_neuro', 'apresentacao', 'servico', 'O que é a avaliação',
 E'A Avaliação Neuropsicológica é um processo técnico que mapeia o funcionamento cognitivo — atenção, memória, funções executivas, linguagem, entre outros.\n\nNa Allos, a avaliação inclui:\n✔️ Entrevista clínica inicial (anamnese)\n✔️ Sessões de testagem (conforme complexidade do caso)\n✔️ Correção e análise dos resultados\n✔️ Elaboração de laudo técnico detalhado\n✔️ Sessão de devolutiva com o paciente/família\n\nDuração total estimada: 2 a 4 semanas 📋',
 0, false),

-- === AVALIAÇÃO NEURO — Proposta ===
('avaliacao_neuro', 'proposta', 'introducao', 'Proposta financeira',
 E'Agora vou te apresentar as condições de pagamento:\n\nValor da avaliação: R${valor_total}\n\n{opcoes_pagamento}\n\nQual forma de pagamento é melhor para você?',
 0, false),

('avaliacao_neuro', 'proposta', 'pix', 'Pagamento via Pix',
 E'💰 Pix à vista: R${valor_pix} ({desconto}% de desconto)\nChave Pix: {pix_chave}\nTitular: {pix_nome}',
 1, false),

('avaliacao_neuro', 'proposta', 'stripe', 'Pagamento via cartão',
 E'💳 Cartão de crédito: até {max_parcelas}x de R${valor_parcela}',
 2, false),

-- === AVALIAÇÃO NEURO — Agendamento ===
('avaliacao_neuro', 'agendamento', 'pos_pagamento', 'Pós-pagamento',
 E'Pagamento confirmado! ✅\n\nAgora vamos agendar suas sessões:\n\n📅 Sessão 1 — Anamnese (entrevista): {data_anamnese}\n📅 Sessões de testagem: serão agendadas após a anamnese\n📅 Devolutiva: será agendada após a conclusão do laudo\n\nVou te enviar as orientações para a primeira sessão!',
 0, false),

-- === AVALIAÇÃO NEURO — Objeções ===
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
 3, true);
