-- =============================================================
-- RESET TOTAL: Apaga TODOS os dados — formação, certificados,
-- condutores, atividades, avaliações, AvaliAllos
-- Mantém apenas: formacao_horarios, slots_fixos (estrutura de horários)
-- =============================================================

BEGIN;

-- ── FORMAÇÃO ────────────────────────────────────────────────
DELETE FROM formacao_alocacoes;
DELETE FROM formacao_slots;
DELETE FROM formacao_cronograma;
DELETE FROM certificado_eventos;

-- ── CERTIFICADOS / FEEDBACKS ────────────────────────────────
DELETE FROM certificado_submissions;
DELETE FROM certificado_condutores;
DELETE FROM certificado_atividades;

-- ── AVALIAÇÕES (AvaliAllos) ─────────────────────────────────
DELETE FROM avaliacoes;
DELETE FROM quadro_participantes;
DELETE FROM quadro_slots;
DELETE FROM avaliador_disp_fixo;
DELETE FROM avaliados;
DELETE FROM avaliadores;

COMMIT;
