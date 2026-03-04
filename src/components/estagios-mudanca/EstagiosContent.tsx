"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface BulletItem { text: string }
interface Stage {
  num: string; title: string; sub: string;
  intro: string[];
  bullets: { heading: string; items: BulletItem[] }[];
  examples?: string[];
}

// ─── Ícone ────────────────────────────────────────────────────────────────────
const IcoChevron = ({ open }: { open: boolean }) => (
  <motion.svg width="13" height="13" viewBox="0 0 13 13" fill="none"
    animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}>
    <path d="M6.5 1V12M1 6.5H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </motion.svg>
);

// ─── Dados dos estágios ───────────────────────────────────────────────────────
const STAGES: Stage[] = [
  {
    num: "01",
    title: "Pré-consciência / Pré-contemplação",
    sub: "O sujeito nega ou minimiza o problema",
    examples: [
      "Paciente com alcoolismo não reconhecido como problema: sugerir que pare de beber está dois graus acima do estágio em que ele se encontra, forçando uma ação em alguém ainda em pré-consciência.",
    ],
    intro: [
      "Nesta fase de pré-contemplação, os indivíduos não se sentem preparados para agir: mantêm-se na defensiva e negam a existência do problema. Evitam ler, conversar ou refletir sobre seus comportamentos, subestimam os benefícios de mudar e superestimam os custos envolvidos. Muitos podem permanecer nesse estágio por anos, prejudicando a si mesmos e a quem está ao seu redor. Somente eventos marcantes — como a morte de um ente querido, o surgimento de uma doença próxima ou grandes transições de vida — costumam mobilizá-los.",
      "Geralmente, não há intenção de tomar qualquer providência no futuro imediato (em torno de seis meses), pois dispõem de pouca ou nenhuma informação sobre as consequências de suas ações atuais. Por isso, as intervenções devem ser iniciadas aos primeiros sinais de dificuldade, de forma cuidadosa, sem aguardar o fundo do poço.",
      "Podemos dizer que, nessa etapa, o sujeito vive numa consciência espontânea — reagindo apenas ao que lhe surge —, irrefletida — sem aprofundar o próprio pensamento — ou tradicional — guiada pelas ideias alheias. O terapeuta deve trabalhar dentro do quadro referencial do sujeito, buscando ampliar gradualmente sua compreensão sem impor interpretações externas.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Estabelecer vínculo/conexão: Demonstrando empatia por meio da escuta ativa, acolhendo sem pressa e validando sentimentos e percepções do paciente." },
        { text: "Construir confiança e engajamento: Adotando postura não julgadora, mostrando-se presente e confiável, reforçando pequenos sinais de abertura e colaboração." },
        { text: "Aumentar a conscientização: Apontando com cuidado contradições ou conflitos no discurso do próprio paciente, estimulando a reflexão sobre esses pontos." },
        { text: "Oferecer informações neutras: Compartilhando dados simples sobre riscos atuais e benefícios da mudança sem pressionar, usando o discurso do sujeito para ampliar o entendimento." },
        { text: "Explorar valores e objetivos pessoais: Perguntando o que é significativo para o paciente na vida (família, trabalho, saúde), observando os impactos da não-contemplação." },
        { text: "Evitar confrontação direta: Reformulando objeções em perguntas abertas para reduzir resistência e manter o diálogo colaborativo." },
      ],
    }],
  },
  {
    num: "02",
    title: "Consciência do problema / Contemplação",
    sub: "Reconhecimento com ambivalência",
    intro: [
      "Nesta fase de contemplação, os sujeitos já reconhecem os benefícios de agir para promover mudanças em sua vida, mas permanecem agudamente conscientes dos custos envolvidos. Esse confronto entre prós e contras gera uma ambivalência profunda, que muitas vezes se expressa como uma oscilação entre atração e repulsa — semelhante ao relacionamento de amor e ódio que pode ocorrer na dependência química ou em laços afetivos conflituosos.",
      "Frequentemente, essa ambivalência leva a uma imobilização prolongada, caracterizada por um período crônico de reflexão ou por uma procrastinação comportamental. Apesar de existir a intenção de mudar, muitos acabam estacionados nesse estágio por longos períodos e, em alguns casos, até desistem de iniciar a transformação.",
      "Os autores chamam esse padrão de \"contemplação crônica\" ou \"procrastinação comportamental\", pois é exatamente aqui que a maioria das pessoas paralisa e não avança para a ação.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Abordar a ambivalência e a incerteza: Conduzir um balanço reflexivo em que o paciente visualize os prós e contras da mudança, explore dúvidas e receios abertamente, e reflita sobre como cada aspecto pesa em suas motivações." },
        { text: "Avaliar comportamento e possíveis resultados: Mapear o comportamento atual e suas barreiras, utilizar role-plays ou visualizações para \"modelar\" a mudança, desenhar cenários de como seria o novo padrão de ação." },
        { text: "Explorar a autoeficácia: Resgatar experiências passadas de sucesso, definir pequenas metas testáveis, celebrar cada conquista e oferecer feedback encorajador para fortalecer a crença na própria capacidade de mudança." },
      ],
    }],
  },
  {
    num: "03",
    title: "Preparação",
    sub: "Organização e definição de passos",
    intro: [
      "Nessa fase de preparação, o indivíduo já adotou atitudes relevantes nos últimos meses — agendou consultas médicas, buscou terapia ou informações e até participou de grupos de apoio — mostrando clara disposição para a mudança. A intenção é agir num futuro muito próximo (cerca de um mês).",
      "É também o momento de estruturar o plano de ação: se o objetivo for, por exemplo, emagrecer, a pessoa já pesquisa profissionais de saúde, investiga quais tipos de exercício praticar e onde, e estuda diferentes abordagens alimentares.",
      "Embora já existam movimentos concretos em direção ao objetivo, ainda não se configura a ação propriamente dita — mas sim a organização e o delineamento dos passos iniciais para a transformação.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Elaborar o plano de ação: Auxiliar o paciente a definir etapas concretas (o quê, como, quando e onde), prazos realistas e recursos necessários para cada tarefa." },
        { text: "Mobilizar informações e apoios: Orientar na busca de profissionais (médicos, terapeutas, nutricionistas), materiais de leitura e grupos de suporte, facilitando o contato e o agendamento de consultas." },
        { text: "Comprometer-se e acompanhar progressos: Incentivar o registro de compromissos (ex: assinatura de um \"contrato de mudança\" dentro do contrato terapêutico), uso de lembretes/calendários e revisões periódicas do avanço." },
      ],
    }],
  },
  {
    num: "04",
    title: "Ação",
    sub: "Implementação das mudanças",
    intro: [
      "Nessa fase de ação, os sujeitos começam a implementar mudanças reais em seu estilo de vida e em comportamentos específicos. Os sujeitos passam a conduzir pequenos experimentos, testando suas hipóteses no cotidiano e adotando estratégias para alcançar os resultados desejados.",
      "É aqui que o plano de ação delineado na etapa anterior ganha vida: as ações planejadas são efetivamente colocadas em prática, marcando uma fase de maior envolvimento e dinamismo. O paciente engaja-se em condutas específicas para dar forma à transformação e utiliza o espaço terapêutico para monitorar, validar e aperfeiçoar seu plano. Além disso, cria condições externas — como rotinas estruturadas, ambientes favoráveis e recursos de apoio — que potencializam sua autoeficácia.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Revisando o plano de ação: Incentivar o paciente a ajustar seu plano conforme avança nas ações, avaliando o que está funcionando e o que precisa ser modificado." },
        { text: "Apoio social e externo: Ajudar o paciente a identificar recursos e apoio de amigos, familiares ou grupos para sustentar as mudanças desejadas." },
        { text: "Estabelecendo metas tangíveis: Focar em ações específicas e mensuráveis, para que o paciente veja progresso concreto em direção à mudança." },
        { text: "Promover a autorregulação: Estimular o paciente a monitorar seu comportamento e refletir sobre os resultados das ações tomadas para reforçar o engajamento." },
        { text: "Reforçar conquistas e autoeficácia: Reconhecer e celebrar cada progresso, oferecer feedback positivo e incentivar o registro dos avanços para consolidar a confiança na própria capacidade." },
        { text: "Gerenciar barreiras e prevenir recaídas: Identificar desafios emergentes, elaborar planos de contingência para gatilhos e aplicar técnicas de enfrentamento sempre que necessário." },
        { text: "Ajustar suporte e consolidar autonomia: Facilitar o acionamento de recursos externos, reforçar a responsabilidade pessoal e promover a incorporação das mudanças ao cotidiano." },
      ],
    }],
  },
  {
    num: "05",
    title: "Manutenção",
    sub: "Consolidação e prevenção de recaídas",
    intro: [
      "No estágio de manutenção, segundo Prochaska, as pessoas continuam engajadas em manter as mudanças já alcançadas, embora utilizem os processos de mudança com menos frequência do que na fase da ação. As recaídas tornam-se menos comuns, e cresce a confiança de que é possível sustentar os novos comportamentos. Esse período pode durar de seis meses a cinco anos.",
      "Um dos principais desafios é lidar com o esforço prolongado que a manutenção exige. A metáfora proposta é a de uma maratona: exige resistência para atravessar estados emocionais como tristeza, ansiedade, raiva, tédio, solidão, estresse e desconforto — de formas mais saudáveis e consistentes.",
      "As mudanças de comportamento se consolidam e se tornam visíveis no estilo de vida. A pessoa mostra-se menos vulnerável a recaídas e mais segura quanto à sua capacidade de seguir com a transformação.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Reforçar a prevenção de recaídas: Revisar e praticar regularmente as estratégias de coping identificadas; antecipar gatilhos emocionais e elaborar planos de contingência claros." },
        { text: "Sustentar a autoeficácia: Registro sistemático de sucessos e desafios, celebrar marcos alcançados e promover reflexões periódicas sobre o próprio progresso." },
        { text: "Gerenciar emoções e estresse prolongado: Ensaiar respostas adaptativas a sentimentos aversivos e revisar o uso dessas ferramentas no dia a dia." },
        { text: "Planejar suporte contínuo: Fortalecer a rede de apoio — terapeuta, amigos, grupos de suporte — e garantir acesso rápido a recursos em momentos de maior vulnerabilidade." },
        { text: "Avaliar e ajustar o plano de manutenção: Monitorar sistematicamente resultados, identificar sinais precoces de recaída e adaptar estratégias conforme surgem novas demandas ou contextos de vida." },
      ],
    }],
  },
  {
    num: "06",
    title: "Finalização",
    sub: "Estabilidade consolidada",
    intro: [
      "No estágio de encerramento ou estabilidade consolidada, a pessoa sente-se confiante em sua capacidade de manter as mudanças e não retornar aos antigos padrões disfuncionais. As condutas anteriores foram superadas a tal ponto que não representam mais uma ameaça, mesmo diante de situações desafiadoras. Esse é o cenário ideal — contudo, para muitos, o mais realista é alcançar e sustentar uma vida em manutenção constante.",
      "Em processos psicoterapêuticos voltados ao aperfeiçoamento pessoal, esse estágio se traduz não apenas na consolidação de novos comportamentos, mas também na capacidade da pessoa-sujeito de compreender seu próprio processo. Essa meta-compreensão favorece a construção de sínteses existenciais, a formulação de diretrizes de vida e a descoberta de sentido (como destaca Frankl) — tudo integrado ao viver cotidiano de forma autêntica e consciente.",
    ],
    bullets: [{
      heading: "O que é interessante nessa fase?",
      items: [
        { text: "Estimular a meta-compreensão do processo: Conduzir reflexões estruturadas sobre a trajetória de mudança, ajudando o paciente a identificar quais fatores internos e externos sustentaram sua transformação." },
        { text: "Promover sínteses existenciais: Utilizar exercícios narrativos ou desenhos de linha de vida para integrar experiências passadas e presentes, revelando temas centrais que dão coerência à história pessoal." },
        { text: "Definir diretrizes de vida e propósito: Auxiliar na escolha consciente de valores e objetivos de longo prazo, vinculando-os a ações diárias e indicadores pessoais de realização." },
        { text: "Cultivar a descoberta de sentido: Incitar a reflexão para conectar pequenas conquistas a um sentido de vida mais amplo (Frankl)." },
        { text: "Consolidar autonomia reflexiva: Incentivar registros periódicos de insights (diário, gravações ou mapas mentais), revisões regulares de metas existenciais e o compartilhamento de aprendizados." },
      ],
    }],
  },
];

// ─── Dados das relações ───────────────────────────────────────────────────────
const RELATIONS = [
  {
    transition: "Pré-contemp. → Contemplação",
    items: [
      {
        title: "Aumento da consciência",
        text: "Desenvolvimento progressivo da percepção sobre causas, consequências e possibilidades de superação de um problema. Intervenções adequadas: observação, interpretação, devolutiva (feedback), psicoeducação e biblioterapia. Em vez de confrontações, é mais eficaz destacar as causas e consequências de manter-se como está.",
      },
      {
        title: "Alívio mobilizador",
        text: "Compreensão emocional do que se está vivenciando, acompanhada do alívio que a mudança pode proporcionar. Intervenções eficazes: dramatizações (psicodrama e role-playing), experiências de luto simbólico, depoimentos pessoais e contato emocional com sentimentos como medo, culpa, esperança e inspiração.",
      },
      {
        title: "Reavaliação do ambiente",
        text: "Refletir, de forma cognitiva e emocional, sobre como o comportamento atual afeta o meio social. Intervenções: vivências de empatia, clarificação de valores e envolvimento de figuras significativas (familiares ou colegas de trabalho). Prochaska cita um comercial: \"Sempre tive medo de que fumar me causasse câncer. Mas nunca pensei que isso poderia matar minha esposa.\"",
      },
    ],
  },
  {
    transition: "Contemplação → Preparação",
    items: [
      {
        title: "Auto-reavaliação",
        text: "Capacidade de se imaginar livre do problema. Em vez de manter o foco nas causas que originaram o comportamento indesejado, a ênfase está no futuro e no potencial de transformação. Intervenções: visualizações, exposição a modelos saudáveis de comportamento e exercícios de clarificação de valores.",
      },
    ],
  },
  {
    transition: "Preparação → Ação",
    items: [
      {
        title: "Crença e compromisso pessoal",
        text: "Fortalecimento da crença na própria capacidade de mudar e do comprometimento com esse processo. Estratégias mais eficazes são as públicas e visíveis, que aumentam a responsabilidade pessoal. Também é útil ampliar as opções de caminho — ex: quem quer parar de fumar pode recorrer à redução progressiva, aos substitutos de nicotina e ao abandono completo.",
      },
    ],
  },
  {
    transition: "Ação → Manutenção",
    items: [
      {
        title: "Gerenciamento de contingências",
        text: "Utilizar reforços positivos para cada passo dado em direção à mudança. Os reforços internos (auto-reforços) são mais recomendáveis que os externos, pois estão sob maior controle da própria pessoa e podem ser aplicados com mais constância no momento exato da \"tentação\".",
      },
      {
        title: "Relacionamentos de apoio",
        text: "Fundamentais para oferecer cuidado, aceitação, confiança e incentivo durante o processo de mudança. Intervenções: fortalecimento do vínculo terapêutico, ligações de apoio, grupos de ajuda mútua ou a figura de um \"padrinho\". Se houver dependência excessiva do apoio social, recomenda-se sua redução gradual.",
      },
      {
        title: "Contracondicionamento",
        text: "Aprendizado de novos comportamentos mais saudáveis em substituição aos antigos. Técnicas: dessensibilização, assertividade, reestruturação cognitiva e outras formas de lidar com desconfortos — como conversar com alguém, praticar exercícios físicos, meditar ou fazer exercícios de relaxamento profundo.",
      },
      {
        title: "Controle de estímulos",
        text: "Modificar o ambiente para favorecer comportamentos saudáveis e desencorajar os indesejados. Exemplos: evitar gatilhos, reorganizar espaços (retirar ultraprocessados da despensa), descartar cigarros, evitar ambientes que incentivem comportamentos prejudiciais e participar de grupos de apoio.",
      },
    ],
  },
];

// ─── Competências ─────────────────────────────────────────────────────────────
const COMPETENCIAS = [
  { cat: "Estrutura", name: "Estágio de Mudança", href: "#", active: true },
  { cat: "Estrutura", name: "Estrutura do Atendimento", href: "#" },
  { cat: "Estrutura", name: "Abertura & Encerramento", href: "#" },
  { cat: "Relação", name: "Acolhimento", href: "#" },
  { cat: "Relação", name: "Segurança no Terapeuta", href: "#" },
  { cat: "Relação", name: "Segurança no Método", href: "#" },
  { cat: "Formulação", name: "Aprofundar / Investigação", href: "#" },
  { cat: "Formulação", name: "Hipóteses Clínicas", href: "#" },
  { cat: "Formulação", name: "Interpretação", href: "#" },
  { cat: "Performance", name: "Frase & Timing", href: "#" },
  { cat: "Performance", name: "Corpo & Setting", href: "#" },
  { cat: "Performance", name: "Insight & Potência", href: "#" },
];

const CAT_COLORS: Record<string, string> = {
  "Estrutura": "#C84B31",
  "Relação": "#D4854A",
  "Formulação": "#B84060",
  "Performance": "#8B5CF6",
};

// ─── Timeline ─────────────────────────────────────────────────────────────────
function StageTimeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="relative">
      <div className="absolute top-5 left-0 right-0 h-px hidden md:block pointer-events-none"
        style={{ background: "rgba(200,75,49,0.1)" }} />
      <motion.div className="absolute top-5 left-0 h-px hidden md:block pointer-events-none"
        style={{ background: "linear-gradient(to right,#C84B31,rgba(200,75,49,0.25))" }}
        initial={{ width: "0%" }}
        animate={inView ? { width: `${(active / 5) * 100}%` } : {}}
        transition={{ duration: 1, delay: 0.4, ease: [0.22,1,0.36,1] }} />
      <div className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-0">
        {STAGES.map((s, i) => (
          <motion.button key={s.num} onClick={() => onSelect(i)}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22,1,0.36,1] }}
            className="flex flex-col items-center gap-2" style={{ outline: "none", background: "none", border: "none", cursor: "pointer" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-dm font-bold text-xs transition-all duration-300"
              style={{
                background: i <= active ? "#C84B31" : "rgba(253,251,247,0.05)",
                border: i === active ? "2px solid #C84B31" : i < active ? "2px solid rgba(200,75,49,0.35)" : "1px solid rgba(253,251,247,0.1)",
                color: i <= active ? "#fff" : "rgba(253,251,247,0.35)",
                boxShadow: i === active ? "0 0 0 5px rgba(200,75,49,0.18)" : "none",
              }}>
              {s.num}
            </div>
            <span className="font-dm text-[10px] text-center leading-tight hidden md:block"
              style={{
                color: i === active ? "#C84B31" : i < active ? "rgba(253,251,247,0.45)" : "rgba(253,251,247,0.2)",
                maxWidth: "78px",
              }}>
              {s.title}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Stage card ───────────────────────────────────────────────────────────────
function StageCard({ stage, index, isOpen, onToggle }: {
  stage: Stage; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.04, duration: 0.6, ease: [0.22,1,0.36,1] }}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: isOpen ? "rgba(200,75,49,0.05)" : "rgba(253,251,247,0.025)",
        border: isOpen ? "1px solid rgba(200,75,49,0.25)" : "1px solid rgba(253,251,247,0.06)",
        transition: "background 0.3s, border-color 0.3s",
      }}
      onClick={onToggle}>
      {/* barra lateral */}
      <motion.div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: "#C84B31", originY: 0 }}
        animate={{ scaleY: isOpen ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.22,1,0.36,1] }} />

      {/* header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-fraunces font-bold flex-shrink-0"
            style={{
              background: isOpen ? "rgba(200,75,49,0.15)" : "rgba(253,251,247,0.04)",
              border: isOpen ? "1px solid rgba(200,75,49,0.3)" : "1px solid rgba(253,251,247,0.07)",
              color: isOpen ? "#C84B31" : "rgba(253,251,247,0.35)",
              fontSize: "14px", transition: "all 0.3s",
            }}>
            {stage.num}
          </div>
          <div>
            <p className="font-fraunces font-bold leading-tight"
              style={{ fontSize: "clamp(15px,1.7vw,17px)", color: isOpen ? "#FDFBF7" : "rgba(253,251,247,0.82)", transition: "color 0.3s" }}>
              {stage.title}
            </p>
            <p className="font-dm text-xs mt-0.5 transition-colors duration-300"
              style={{ color: isOpen ? "rgba(200,75,49,0.75)" : "rgba(253,251,247,0.28)" }}>
              {stage.sub}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: isOpen ? "#C84B31" : "rgba(253,251,247,0.05)",
            border: isOpen ? "none" : "1px solid rgba(253,251,247,0.09)",
            color: isOpen ? "#fff" : "rgba(253,251,247,0.45)",
            transition: "all 0.3s",
          }}>
          <IcoChevron open={isOpen} />
        </div>
      </div>

      {/* body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22,1,0.36,1] }}
            style={{ overflow: "hidden" }}>
            <div className="px-6 pb-8 pt-5" style={{ borderTop: "1px solid rgba(253,251,247,0.05)" }}>
              {/* Exemplos */}
              {stage.examples && stage.examples.map((ex, i) => (
                <div key={i} className="rounded-xl p-5 mb-7"
                  style={{
                    background: "rgba(200,75,49,0.06)",
                    border: "1px solid rgba(200,75,49,0.15)",
                    borderLeft: "3px solid rgba(200,75,49,0.55)",
                  }}>
                  <p className="font-dm text-xs font-semibold tracking-widest uppercase text-[#C84B31] mb-2">Exemplo</p>
                  <p className="font-dm leading-relaxed text-sm" style={{ color: "rgba(253,251,247,0.68)" }}>{ex}</p>
                </div>
              ))}
              {/* Parágrafos */}
              <div className="space-y-4 mb-6">
                {stage.intro.map((p, i) => (
                  <p key={i} className="font-dm leading-relaxed"
                    style={{ fontSize: "15px", color: "rgba(253,251,247,0.58)" }}>{p}</p>
                ))}
              </div>
              {/* Bullets */}
              {stage.bullets.map((section, si) => (
                <div key={si} className="mt-7">
                  <p className="font-dm font-semibold text-xs tracking-widest uppercase pb-3 mb-5"
                    style={{ color: "#C84B31", borderBottom: "1px solid rgba(200,75,49,0.15)" }}>
                    {section.heading}
                  </p>
                  <div className="space-y-3">
                    {section.items.map((item, ii) => {
                      const colonIdx = item.text.indexOf(":");
                      const bold = colonIdx > -1 ? item.text.slice(0, colonIdx) : "";
                      const rest = colonIdx > -1 ? item.text.slice(colonIdx) : item.text;
                      return (
                        <motion.div key={ii}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ii * 0.04, duration: 0.38 }}
                          className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C84B31] mt-[9px] opacity-60" />
                          <p className="font-dm leading-relaxed" style={{ fontSize: "14px", color: "rgba(253,251,247,0.58)" }}>
                            {bold && <strong className="font-semibold" style={{ color: "rgba(253,251,247,0.83)" }}>{bold}</strong>}
                            {rest}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Seção intro com exemplos ─────────────────────────────────────────────────
function IntroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <section ref={ref} className="relative py-20 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Esquerda — contexto */}
          <div className="md:w-1/2">
            <motion.p className="font-dm text-xs font-semibold tracking-widest uppercase text-[#C84B31] mb-4"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
              Por que isso importa
            </motion.p>
            <motion.h2 className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-5"
              style={{ fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22,1,0.36,1] }}>
              O modelo dos estágios de mudança
            </motion.h2>
            <div className="space-y-4">
              {[
                "Compreender os estágios de mudança, por si só, já pode transformar significativamente a qualidade de um atendimento clínico. Trata-se de um dos aspectos mais potentes para uma prática mais sensível e efetiva.",
                "O modelo diz respeito ao ajuste entre a intervenção terapêutica e o momento específico em que o paciente se encontra em seu processo de transformação. Saber reconhecer esse momento é o que permite ao terapeuta intervir com precisão, sem precipitação nem omissão.",
                "Se o sujeito está em pré-consciência sobre a questão, ouvir e ser empático é fundamental. Confrontá-lo não é adequado, pois a intervenção se torna mais agressiva do que o paciente necessita.",
              ].map((p, i) => (
                <motion.p key={i} className="font-dm leading-relaxed"
                  style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}
                  initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.18 + i * 0.1, duration: 0.6 }}>
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
          {/* Direita — exemplos */}
          <div className="md:w-1/2 space-y-4">
            {[
              {
                label: "Exemplo 1 — intervenção precipitada",
                text: "Se o paciente apresenta alcoolismo, mas ainda não o reconhece como um problema, sugerir diretamente que ele pare de beber pode ser inadequado. Essa mudança está dois graus acima do estágio em que ele se encontra, forçando uma ação em alguém que ainda está em pré-consciência.",
              },
              {
                label: "Exemplo 2 — problematizar no momento errado",
                text: "Imagine um paciente estudando para medicina, com rotina pesada e duas semanas para o ENEM, sem clareza sobre sua escolha. Não é o momento de questionar se ele quer fazer medicina, mas de apoiar e reforçar a ação. Refletir é pré-ação — questionar aqui seria um erro de timing.",
              },
            ].map((ex, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 22 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.13, duration: 0.65, ease: [0.22,1,0.36,1] }}
                className="rounded-xl p-5"
                style={{
                  background: "rgba(200,75,49,0.05)",
                  border: "1px solid rgba(200,75,49,0.14)",
                  borderLeft: "3px solid rgba(200,75,49,0.5)",
                }}>
                <p className="font-dm text-xs font-semibold tracking-widest uppercase text-[#C84B31] mb-2">{ex.label}</p>
                <p className="font-dm leading-relaxed text-sm" style={{ color: "rgba(253,251,247,0.62)" }}>{ex.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Seção relações ───────────────────────────────────────────────────────────
function RelationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <section ref={ref} className="relative py-20 px-6 md:px-10"
      style={{ background: "linear-gradient(to bottom,#1A1A1A,#141414)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="mb-12">
          <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-3">Mapa de transições</p>
          <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-tight"
            style={{ fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-0.02em" }}>
            Relação entre processos{" "}
            <span className="italic text-[#C84B31]">e estágios</span>
          </h2>
          <p className="font-dm mt-3 max-w-[520px]" style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}>
            Cada transição entre estágios é impulsionada por processos específicos. Conhecê-los ajuda o terapeuta a escolher a intervenção certa no momento certo.
          </p>
        </motion.div>
        <div className="space-y-5">
          {RELATIONS.map((group, gi) => (
            <motion.div key={gi}
              initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.6, ease: [0.22,1,0.36,1] }}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(253,251,247,0.06)", background: "rgba(253,251,247,0.018)" }}>
              {/* header da transição */}
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ borderBottom: "1px solid rgba(253,251,247,0.04)", background: "rgba(200,75,49,0.04)" }}>
                <div className="h-px w-4 flex-shrink-0" style={{ background: "rgba(200,75,49,0.5)" }} />
                <p className="font-dm font-semibold text-xs tracking-widest uppercase"
                  style={{ color: "rgba(200,75,49,0.75)" }}>
                  {group.transition}
                </p>
              </div>
              {/* itens */}
              <div className={group.items.length > 1 ? "grid md:grid-cols-2" : ""}>
                {group.items.map((item, ii) => (
                  <div key={ii} className="p-6"
                    style={{ borderRight: ii < group.items.length - 1 && group.items.length > 1 ? "1px solid rgba(253,251,247,0.04)" : "none" }}>
                    <p className="font-fraunces font-bold mb-3" style={{ fontSize: "15px", color: "#C84B31" }}>
                      {item.title}
                    </p>
                    <p className="font-dm leading-relaxed" style={{ fontSize: "14px", color: "rgba(253,251,247,0.52)" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Grade de competências ────────────────────────────────────────────────────
function CompetenciasGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const categories = [...new Set(COMPETENCIAS.map(c => c.cat))];
  return (
    <section ref={ref} className="relative py-20 px-6 md:px-10" style={{ background: "#141414" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%,rgba(200,75,49,0.06) 0%,transparent 70%)" }} />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right,transparent,rgba(200,75,49,0.5))" }} />
            <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase">AvaliAllos</p>
            <div className="h-px w-12" style={{ background: "linear-gradient(to right,rgba(200,75,49,0.5),transparent)" }} />
          </div>
          <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-3"
            style={{ fontSize: "clamp(20px,3vw,30px)", letterSpacing: "-0.02em" }}>
            Confira as demais{" "}
            <span className="italic text-[#C84B31]">competências avaliadas</span>
          </h2>
          <p className="font-dm mx-auto max-w-[460px]"
            style={{ fontSize: "14px", color: "rgba(253,251,247,0.38)" }}>
            Os critérios se organizam em estrutura, relação clínica, formulação e performance — clique para acessar.
          </p>
        </motion.div>
        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <div key={cat}>
              <motion.div initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: ci * 0.07, duration: 0.5 }}
                className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[cat] || "#C84B31" }} />
                <p className="font-dm font-semibold text-xs tracking-widest uppercase"
                  style={{ color: "rgba(253,251,247,0.3)" }}>
                  {cat}
                </p>
                <div className="flex-1 h-px" style={{ background: "rgba(253,251,247,0.05)" }} />
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {COMPETENCIAS.filter(c => c.cat === cat).map((comp, i) => (
                  <motion.a key={comp.name} href={comp.href}
                    initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: ci * 0.07 + i * 0.05, duration: 0.5, ease: [0.22,1,0.36,1] }}
                    className="relative rounded-xl p-4 block"
                    style={{
                      background: comp.active ? "rgba(200,75,49,0.09)" : "rgba(253,251,247,0.022)",
                      border: comp.active ? "1px solid rgba(200,75,49,0.32)" : "1px solid rgba(253,251,247,0.055)",
                      borderLeft: `3px solid ${CAT_COLORS[comp.cat] || "#C84B31"}`,
                      textDecoration: "none",
                    }}
                    whileHover={{ y: -3, boxShadow: "0 10px 26px rgba(0,0,0,0.28)" }}
                    transition={{ duration: 0.18 }}>
                    {comp.active && (
                      <span className="absolute top-2 right-2 font-dm text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(200,75,49,0.18)", color: "#C84B31" }}>
                        Esta aqui
                      </span>
                    )}
                    <p className="font-dm font-medium leading-snug"
                      style={{ fontSize: "13px", color: comp.active ? "rgba(253,251,247,0.88)" : "rgba(253,251,247,0.6)" }}>
                      {comp.name}
                    </p>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Export principal ─────────────────────────────────────────────────────────
export default function EstagiosContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [timelineActive, setTimelineActive] = useState(0);

  const handleTimeline = (i: number) => {
    setTimelineActive(i);
    setOpenIndex(i);
  };

  const handleToggle = (i: number) => {
    const next = openIndex === i ? null : i;
    setOpenIndex(next);
    if (next !== null) setTimelineActive(next);
  };

  return (
    <>
      <IntroSection />

      {/* Estágios + Timeline */}
      <section className="relative py-6 pb-20 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{ backgroundImage: GRAIN }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Timeline nav */}
          <div className="mb-12 p-6 rounded-2xl"
            style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.05)" }}>
            <p className="font-dm text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ color: "rgba(253,251,247,0.28)" }}>
              Navegue pelos estágios
            </p>
            <StageTimeline active={timelineActive} onSelect={handleTimeline} />
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[44px]"
              style={{ background: "linear-gradient(to right,transparent,rgba(200,75,49,0.4))" }} />
            <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase">Os 6 estágios</p>
            <div className="h-px flex-1"
              style={{ background: "linear-gradient(to right,rgba(200,75,49,0.4),transparent)" }} />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {STAGES.map((stage, i) => (
              <StageCard key={stage.num} stage={stage} index={i}
                isOpen={openIndex === i} onToggle={() => handleToggle(i)} />
            ))}
          </div>
        </div>
      </section>

      <RelationsSection />
      <CompetenciasGrid />
    </>
  );
}
