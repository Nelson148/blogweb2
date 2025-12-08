## Equipe de Desenvolvedores

Victor Guilhereme
Alvaro Nelson
Herick Jonathan

# 📘 Blog Fullstack - Next.js com MongoDB

Este repositório contém um projeto de **Blog Fullstack** desenvolvido com **Next.js 16 (App Router)**, **MongoDB Atlas**, **NextAuth.js** e **HeroUI**. O projeto demonstra a construção de uma aplicação moderna, segura e performática com sistema de autenticação, posts, comentários e gerenciamento de usuários.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind-38bdf8)
![HeroUI](https://img.shields.io/badge/UI-HeroUI-006FEE)

---

## 🎯 Funcionalidades

- ✅ **Sistema de Autenticação** completo (Login/Registro)
- ✅ **Criação de Posts** (apenas administradores)
- ✅ **Sistema de Comentários** nos posts
- ✅ **Perfil de Usuário** com upload de imagem
- ✅ **Proteção de Rotas** com middleware
- ✅ **Interface Moderna** com HeroUI e Tailwind CSS
- ✅ **Responsivo** para mobile e desktop
- ✅ **Estatísticas** do site (posts, usuários, comentários)

---

## 🛠️ Stack Tecnológica

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **Next.js 16** | Framework Fullstack (Frontend + Backend) |
| **TypeScript** | Tipagem estática para evitar erros |
| **Tailwind CSS** | Estilização rápida e responsiva |
| **HeroUI** | Biblioteca de componentes UI moderna |
| **MongoDB Atlas** | Banco de dados na nuvem (NoSQL) |
| **Mongoose** | ODM para modelar e validar dados |
| **NextAuth.js** | Gerenciamento de sessão e segurança |
| **BcryptJS** | Criptografia de senhas (Hashing) |
| **Lucide React** | Ícones modernos |

---

## 🚀 Como rodar o projeto na sua máquina

### 1. Pré-requisitos

Certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* [Git](https://git-scm.com/)
* Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita)

### 2. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd blog-victor/blog
```

### 3. Instalar dependências

```bash
npm install
```

**⚠️ IMPORTANTE:** Se encontrar erros de permissão durante a instalação (especialmente no Windows com OneDrive):

```bash
# Limpar cache do npm
npm cache clean --force

# Instalar ignorando scripts (se necessário)
npm install --ignore-scripts

# Ou instalar com flags de força
npm install --legacy-peer-deps --force
```

**💡 Dica:** Se o projeto estiver em uma pasta sincronizada pelo OneDrive, considere mover para uma pasta local para evitar problemas de permissão.

### 4. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto (`blog-victor/blog/.env.local`) e preencha com as seguintes variáveis:

```env
# Conexão com o Banco MongoDB Atlas
# Formato: mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco
MONGODB_URI="mongodb+srv://usuario:senha@cluster.mongodb.net/meubanco?appName=Cluster0"

# URL da aplicação (em desenvolvimento)
NEXTAUTH_URL="http://localhost:3000"

# Chave secreta para encriptar os tokens de sessão
# Gere uma hash aleatória com: openssl rand -base64 32
# Ou use: https://generate.plus/en/base64
NEXTAUTH_SECRET="sua-hash-secreta-aqui-com-pelo-menos-32-caracteres"

# Chave Mestra para criação de contas Administrativas
# IMPORTANTE: Mantenha esta chave em segredo!
ADMIN_SECRET_KEY="senhasupersecreta"
```

**🔐 Como obter as variáveis:**

1. **MONGODB_URI:**
   - Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crie um cluster gratuito
   - Vá em "Connect" → "Connect your application"
   - Copie a string de conexão e substitua `<password>` pela sua senha

2. **NEXTAUTH_SECRET:**
   - Execute no terminal: `openssl rand -base64 32`
   - Ou gere em: https://generate.plus/en/base64

3. **ADMIN_SECRET_KEY:**
   - Defina uma senha forte e secreta
   - Esta chave será necessária para criar contas de administrador

### 5. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:3000** no seu navegador.

**⚠️ Se aparecer erro de porta em uso:**

```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Ou simplesmente mude a porta
npm run dev -- -p 3001
```

---

## 👤 Como criar um Administrador

Existem **duas formas** de criar uma conta de administrador:

### Método 1: Página de Registro Administrativo (Recomendado)

1. Acesse: **http://localhost:3000/registrar/adm**
2. Preencha os campos:
   - **Nome Completo**
   - **Email Corporativo**
   - **Senha** (mínimo 6 caracteres)
   - **Chave Mestra** (use o valor de `ADMIN_SECRET_KEY` do `.env.local`)
3. Clique em "Criar Conta Admin"
4. Faça login normalmente em **http://localhost:3000/login**

### Método 2: Registro Normal com Email Especial

1. Acesse: **http://localhost:3000/registrar**
2. Use o email: **admin@admin.com**
3. Preencha nome e senha
4. Automaticamente será criado como administrador

**⚠️ IMPORTANTE:**
- Apenas administradores podem criar posts
- Usuários comuns podem apenas comentar e visualizar
- Mantenha a `ADMIN_SECRET_KEY` segura!

---

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Rota do NextAuth (Login/Logout)
│   │   ├── posts/                  # API de Posts
│   │   ├── comments/               # API de Comentários
│   │   └── users/                  # API de Usuários
│   │
│   ├── login/                      # Página de Login
│   ├── registrar/                  # Página de Registro
│   │   └── adm/                    # Página de Registro Admin
│   ├── post/                       # Página de Posts (Protegida)
│   ├── perfil/                     # Página de Perfil (Protegida)
│   │
│   ├── actions.ts                  # ⚡ SERVER ACTIONS (Backend Logic)
│   ├── layout.tsx                  # Layout Global
│   ├── page.tsx                    # Home Page
│   ├── loading.tsx                 # Loading State
│   └── not-found.tsx               # 404 Page
│
├── components/
│   ├── Navbar.tsx                  # Barra de navegação
│   ├── Footer.tsx                  # Rodapé
│   ├── PostCard.tsx                # Card de Post
│   ├── StatsCard.tsx               # Card de Estatísticas
│   ├── UserAvatar.tsx              # Avatar do usuário
│   └── ParticlesBackground.tsx     # Efeito de partículas
│
├── lib/
│   ├── auth.ts                     # Configuração do NextAuth
│   └── db.ts                       # Conexão Singleton com MongoDB
│
├── models/
│   ├── User.ts                     # Schema de Usuário
│   ├── Post.ts                     # Schema de Post
│   └── Comment.ts                  # Schema de Comentário
│
└── middleware.ts                   # Proteção de Rotas
```

---

## 🔐 Rotas Protegidas

As seguintes rotas requerem autenticação:

- `/post` - Visualizar e criar posts
- `/perfil` - Gerenciar perfil do usuário

**Comportamento:**
- Usuários não autenticados são redirecionados para `/login`
- Após login, são redirecionados de volta para a rota original
- Usuários logados não podem acessar `/login` ou `/registrar` (redirecionados para home)

---

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa o linter
```

---

## ⚠️ Avisos Importantes

### 1. Variáveis de Ambiente
- **NUNCA** commite o arquivo `.env.local` no Git
- Mantenha as chaves secretas em segurança
- Em produção, use variáveis de ambiente do servidor

### 2. MongoDB Atlas
- Configure o IP whitelist no MongoDB Atlas para permitir conexões
- Use `0.0.0.0/0` apenas em desenvolvimento (permite qualquer IP)
- Em produção, restrinja aos IPs do servidor

### 3. Upload de Imagens
- Imagens são armazenadas como Base64 no banco de dados
- Limite de 2MB para imagens de perfil
- Limite de 10MB para imagens de posts
- Para produção, considere usar serviços como Cloudinary ou AWS S3

### 4. Performance
- O projeto usa o padrão Singleton para conexão com MongoDB
- Isso evita múltiplas conexões em ambiente serverless
- Imagens grandes podem impactar a performance

### 5. Segurança
- Senhas são criptografadas com bcrypt (10 rounds)
- Tokens de sessão são armazenados em cookies httpOnly
- Rotas protegidas verificam autenticação no servidor

### 6. OneDrive / Sincronização de Arquivos
- Se o projeto estiver em pasta sincronizada (OneDrive, Dropbox, etc):
  - Pode causar problemas de permissão durante `npm install`
  - Considere mover para uma pasta local
  - Ou pause a sincronização durante instalação

---

## 🐛 Solução de Problemas Comuns

### Erro: "MODULE_NOT_FOUND"
```bash
# Limpe o cache e reinstale
rm -rf node_modules .next
npm cache clean --force
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Ou use outra porta
npm run dev -- -p 3001
```

### Erro: "Unable to acquire lock"
```bash
# Remova o arquivo de lock
rm -rf .next/dev/lock
# Ou no Windows
Remove-Item -Recurse -Force .next\dev\lock
```

### Erro de permissão no npm install
```bash
# Instale ignorando scripts
npm install --ignore-scripts

# Ou com flags de força
npm install --legacy-peer-deps --force
```

### Imagem não atualiza após upload
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique se o arquivo foi salvo no banco de dados
- Confira os logs do console para erros

---

## 🧠 Conceitos Chave

### ⚡ Server Actions (`actions.ts`)
Funções assíncronas com `'use server'` que permitem mutações de dados sem criar APIs REST manuais. O Next.js cria endpoints seguros automaticamente.

### 🔄 Singleton Pattern (`lib/db.ts`)
Garante que apenas uma conexão com MongoDB seja aberta e reutilizada, evitando gargalos em ambiente serverless.

### 🔐 Proteção de Rotas
- **Middleware:** Verifica autenticação antes de acessar rotas protegidas
- **Server Actions:** Valida sessão antes de operações no banco
- **Client Components:** Redireciona usuários não autenticados

### 🎨 HeroUI Components
Biblioteca moderna de componentes UI que substitui shadcn/ui neste projeto. Componentes principais:
- `Button`, `Card`, `Input`, `Modal`, etc.

---

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação HeroUI](https://heroui.com/)
- [Documentação NextAuth.js](https://next-auth.js.org/)
- [Documentação MongoDB](https://docs.mongodb.com/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

---

## 📧 Suporte

Se encontrar problemas ou tiver dúvidas:
1. Verifique a seção "Solução de Problemas Comuns"
2. Consulte os logs do console do navegador e do terminal
3. Verifique se todas as variáveis de ambiente estão configuradas corretamente

---



