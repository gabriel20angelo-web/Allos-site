# 🌊 Associação Allos — Homepage

Homepage institucional com design dark vanguardista, cena 3D de partículas e animações Framer Motion.

---

## ✅ Pré-requisitos (instale antes de começar)

1. **Node.js** — Baixe em: https://nodejs.org/en
   - Escolha a versão "LTS" (recomendada)
   - Instale normalmente (avance em tudo)

2. **VS Code** — Já instalado (você mencionou que usa)

---

## 🚀 Como rodar o projeto

### Passo 1 — Abra a pasta no VS Code
- File → Open Folder → selecione a pasta `allos-home`

### Passo 2 — Abra o terminal no VS Code
- Menu: Terminal → New Terminal
  (ou pressione `Ctrl + '` no Windows / `Cmd + '` no Mac)

### Passo 3 — Instale as dependências
Cole esse comando no terminal e pressione Enter:

```bash
npm install
```

⏳ Aguarde. Vai baixar os pacotes (pode demorar 1-2 min na primeira vez).

### Passo 4 — Rode o projeto
```bash
npm run dev
```

### Passo 5 — Abra no navegador
Acesse: **http://localhost:3000**

---

## 📁 Estrutura dos arquivos

```
allos-home/
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Configuração geral (fontes, metadata)
│   │   ├── page.tsx        ← Página principal
│   │   └── globals.css     ← Estilos globais
│   └── components/
│       ├── NavBar.tsx         ← Barra de navegação
│       ├── HeroSection.tsx    ← Seção principal (topo)
│       ├── HeroCanvas.tsx     ← Cena 3D de partículas (Three.js)
│       ├── FrentesSection.tsx ← Grid de 4 cards
│       ├── CTASection.tsx     ← Chamada para projetos
│       ├── Footer.tsx         ← Rodapé
│       ├── LoadingScreen.tsx  ← Tela de carregamento
│       └── CustomCursor.tsx   ← Cursor personalizado
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 🎨 Como personalizar

### Trocar textos dos cards
Abra `src/components/FrentesSection.tsx` e edite o array `cards` no início do arquivo.

### Trocar links dos botões
Procure por `href="#"` nos componentes e substitua pela URL desejada.

### Trocar cores
Abra `tailwind.config.ts` e edite os valores em `colors`.
A cor principal turquesa é `#2dd4b8`.

### Trocar endereço/contato no footer
Abra `src/components/Footer.tsx` e edite diretamente o texto.

---

## ❓ Problemas comuns

**"npm: command not found"**
→ O Node.js não foi instalado. Baixe em https://nodejs.org/en e reinicie o VS Code.

**Porta 3000 em uso**
→ O Next.js vai usar a 3001 automaticamente. Acesse http://localhost:3001

**Erro na cena 3D no mobile**
→ Normal em alguns browsers mobile com WebGL limitado. No desktop funciona sempre.

---

## 🏗️ Para fazer o deploy (publicar online)

Recomendamos a **Vercel** (gratuita para projetos pessoais):
1. Crie conta em https://vercel.com
2. Clique em "Add New Project"
3. Faça upload da pasta ou conecte ao GitHub
4. Clique em Deploy — pronto!

---

Feito com ♥ em Belo Horizonte para a Associação Allos.
