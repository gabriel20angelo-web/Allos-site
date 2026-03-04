# AvaliAllos — Guia de Configuração

> Tempo estimado: **5–10 minutos**

---

## 1. Criar conta no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e clique em **Start your project**
2. Entre com GitHub ou crie uma conta por e-mail
3. Clique em **New project**
4. Preencha:
   - **Name:** `avaliallos` (ou qualquer nome)
   - **Database Password:** crie uma senha forte e **salve em lugar seguro**
   - **Region:** `South America (São Paulo)` — menor latência no Brasil
5. Clique em **Create new project** e aguarde ~2 minutos

---

## 2. Criar as tabelas (banco de dados)

1. No painel do Supabase, clique em **SQL Editor** (menu lateral esquerdo)
2. Clique em **New query**
3. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste projeto
4. Cole no editor e clique em **Run** (ou `Ctrl+Enter`)
5. Você deve ver `Success. No rows returned` — significa que funcionou!

---

## 3. Copiar as chaves de acesso

1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem) → **API**
2. Copie:
   - **Project URL** → algo como `https://xyzxyzxyz.supabase.co`
   - **anon public** key → chave longa que começa com `eyJ...`

---

## 4. Configurar variáveis de ambiente

1. Na raiz do projeto Next.js, copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Abra `.env.local` e preencha com os valores copiados:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...sua_chave_completa
   
   NEXT_PUBLIC_AVALIADOR_PASSWORD=Allos@@2026
   NEXT_PUBLIC_ADMIN_PASSWORD=Allos@@2026
   ```

3. Salve o arquivo. **Nunca commite `.env.local` no Git!**
   (Ele já está no `.gitignore`)

---

## 5. Instalar dependências e rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 6. Rotas do sistema AvaliAllos

| Rota | Quem acessa | O que faz |
|------|-------------|-----------|
| `/agendar-avaliacao` | Candidatos | Visualizar horários e agendar avaliação |
| `/avaliador-avaliallos` | Avaliadores (senha) | Gerenciar disponibilidades |
| `/admin-avaliallos` | Administração (senha) | Ver todos agendamentos, aprovar/cancelar, forçar liberar slots |

---

## 7. Deploy (Vercel recomendado)

1. Acesse [vercel.com](https://vercel.com) e importe o repositório GitHub
2. Na tela de configuração, adicione as variáveis de ambiente (mesmas do `.env.local`)
3. Clique em **Deploy**

O Supabase funciona na nuvem, então os dados são compartilhados entre todos que acessam o site.

---

## Regras importantes do sistema

- **Candidatos:** cada um agenda independentemente; um slot fica cheio quando 2 pessoas agendarem
- **Avaliadores:** podem remover slots **somente** se não houver agendamentos; caso contrário, veem aviso
- **Admin:** pode forçar liberar qualquer slot (cancela agendamentos e remove disponibilidades)
- **Confirmação:** aparece na tela após agendamento; a equipe contacta via WhatsApp

---

## Suporte

Dúvidas técnicas: Victor (coordenador de sistemas Allos)
