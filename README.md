# Byte Quest AI 🎮✨

Gerador de imagens com inteligência artificial. Guia o usuário através de formulários detalhados para criar prompts de alta fidelidade e gerar imagens únicas.

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Ícones | Lucide React |
| Backend/Auth/DB | Supabase (PostgreSQL, Auth, Storage) |
| Geração de Imagem | Hugging Face API (Stable Diffusion XL) |
| Tradução de Prompt | Hugging Face API (Helsinki-NLP/opus-mt-tc-big-en) |
| Deploy | Vercel |

---

## 📁 Estrutura do Projeto

```
olympus-images/
├── app/
│   ├── api/
│   │   ├── auth/signout/route.ts    # Logout
│   │   └── generate/route.ts        # Geração de imagem
│   ├── auth/
│   │   ├── callback/route.ts        # Callback OAuth/email
│   │   └── login/page.tsx           # Login/Signup/Recuperação
│   ├── dashboard/
│   │   ├── gallery/page.tsx         # Galeria do usuário
│   │   ├── layout.tsx               # Layout com sidebar
│   │   └── page.tsx                 # Formulário de geração
│   ├── globals.css                  # Tema dark + animações
│   ├── layout.tsx                   # Layout raiz
│   └── page.tsx                     # Landing page
├── components/
│   ├── error-toast.tsx              # Notificação de erros
│   ├── generating-loader.tsx        # Loading animado
│   └── share-button.tsx             # Botão compartilhar (Web Share API)
├── lib/
│   ├── prompt-builder.ts            # Monta prompt + tradução para inglês
│   ├── supabase-browser.ts          # Cliente Supabase (client-side)
│   └── supabase-server.ts           # Cliente Supabase (server-side)
├── supabase-emails/
│   ├── confirm-signup.html          # Template: confirmação de conta
│   ├── reset-password.html          # Template: recuperação de senha
│   ├── magic-link.html              # Template: magic link
│   ├── invite.html                  # Template: convite
│   └── change-email.html            # Template: alteração de email
├── types/
│   └── index.ts                     # Tipos TypeScript
├── middleware.ts                     # Proteção de rotas
├── supabase-schema.sql              # Schema do banco de dados
└── .env.local.example               # Variáveis de ambiente
```

---

## 🎨 Design System

| Elemento | Valor |
|----------|-------|
| Background | `#000000` |
| Surface | `#0a0a0f` |
| Border | `#1e293b` |
| Accent (Azul Elétrico) | `#0ea5e9` |
| Accent Hover | `#38bdf8` |
| Texto | `#ffffff` |
| Texto Secundário | `#94a3b8` |

Estética: **Gamer/Minimalista** com efeitos de glow neon.

---

## 🔐 Autenticação

- **Criar conta** com email e senha (confirmação por email)
- **Login** com email e senha
- **Recuperação de senha** via email
- Sessão gerenciada por cookies (Supabase SSR)
- Middleware protege rotas `/dashboard/*`

---

## 🖼️ Fluxo de Geração de Imagem

1. Usuário preenche o formulário (categoria, assunto, estilo, iluminação, proporção, detalhamento)
2. **Prompt Builder** monta o prompt estruturado
3. API traduz automaticamente para **inglês** (Helsinki-NLP)
4. Prompt é enviado ao **Stable Diffusion XL** (Hugging Face)
5. Imagem gerada é salva no **Supabase Storage**
6. Registro salvo no banco com `user_id`, `prompt`, `image_url`, `category`
7. Imagem aparece na **Galeria** do usuário

---

## 📊 Banco de Dados

### Tabela `profiles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Referência ao auth.users |
| email | TEXT | Email do usuário |
| is_premium | BOOLEAN | Flag para monetização futura |
| generation_count | INTEGER | Contador de gerações |
| created_at | TIMESTAMPTZ | Data de criação |

### Tabela `generated_images`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | ID único |
| user_id | UUID (FK) | Referência ao usuário |
| prompt | TEXT | Prompt utilizado |
| image_url | TEXT | URL da imagem no Storage |
| category | TEXT | realistic, digital-art, pixel-art, 3d-render |
| created_at | TIMESTAMPTZ | Data de criação |

### Segurança (RLS)

- Usuários só acessam seus próprios dados
- Perfil criado automaticamente via trigger no signup

---

## 💰 Monetização (Preparado)

O sistema já possui:
- Campo `is_premium` no perfil do usuário
- Limite de gerações gratuitas (`FREE_LIMIT = 50`)
- Verificação de limite na API antes de gerar
- Pronto para integração com Stripe no futuro

---

## ⚙️ Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
HUGGINGFACE_API_KEY=hf_seu_token
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

---

## 🛠️ Setup Local

```bash
# Instalar dependências
npm install

# Configurar variáveis
cp .env.local.example .env.local
# Edite .env.local com suas chaves

# Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000

---

## 📦 Deploy (Vercel)

1. Conecte o repositório GitHub na [Vercel](https://vercel.com/new)
2. Adicione as variáveis de ambiente em Settings → Environment Variables
3. Deploy automático a cada push na branch `main`

---

## 📧 Configuração do Supabase

1. **SQL Editor** — Execute `supabase-schema.sql`
2. **Storage** — Crie bucket `images` (público)
3. **Authentication → Providers** — Ative Email com confirmação
4. **Authentication → URL Configuration** — Configure Site URL e Redirect URLs
5. **Authentication → Email Templates** — Cole os HTMLs da pasta `supabase-emails/`

---

## 📝 Limites do Plano Gratuito

| Serviço | Limite |
|---------|--------|
| Vercel (Hobby) | 100GB bandwidth/mês |
| Supabase (Free) | 500MB DB, 1GB Storage, 50k auth users |
| Hugging Face (Free) | ~5-10 requests/minuto, cold start ~20-30s |

---

## 🗺️ Roadmap

- [ ] Integração Stripe para plano premium
- [ ] Mais modelos de IA (DALL-E, Midjourney API)
- [ ] Edição de imagem pós-geração
- [ ] Galeria pública / comunidade
- [ ] App mobile (React Native)

---

**Desenvolvido por Cintia Byte Quest** 🎮
