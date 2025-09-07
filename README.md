# Legacy - Question Bank

## 📜 Visão Geral do Projeto

Bem-vindo ao Legacy, um sistema robusto de Banco de Questões projetado para ser uma ferramenta centralizada para educadores e estudantes. A aplicação permite o cadastro, consulta e gerenciamento de questões de múltipla escolha e discursivas, com um sistema de classificação por categoria, dificuldade e reputação.

A arquitetura foi pensada para ser moderna, escalável e de fácil manutenção, utilizando Angular no frontend e um backend ágil com Node.js e Express, tudo comunicado com um banco de dados local SQLite.

## 🛠️ Tecnologias Utilizadas

Este projeto é construído com um conjunto de tecnologias modernas e confiáveis:

* **Frontend:**
    * **Angular v17+:** Um framework poderoso para construir aplicações web dinâmicas e de página única (SPA).
    * **Angular Material:** Uma suíte de componentes de UI de alta qualidade que garante uma experiência de usuário consistente e moderna.
    * **TypeScript:** Superset do JavaScript que adiciona tipagem estática, aumentando a robustez e a manutenibilidade do código.
    * **SCSS:** Um pré-processador CSS que adiciona funcionalidades como variáveis, aninhamento e mixins.
* **Backend:**
    * **Node.js:** Um ambiente de execução JavaScript no servidor, conhecido por sua eficiência e escalabilidade.
    * **Express.js:** Um framework minimalista para Node.js, perfeito para construir APIs RESTful de forma rápida e organizada.
    * **SQLite3:** Um banco de dados SQL leve e baseado em arquivo, ideal para desenvolvimento local e aplicações de pequeno a médio porte.
* **Ferramentas de Desenvolvimento:**
    * **Concurrently:** Uma ferramenta para executar múltiplos comandos ao mesmo tempo, essencial para rodar o frontend e o backend simultaneamente com um único comando.
    * **Nodemon:** Monitora mudanças nos arquivos do backend e reinicia o servidor automaticamente, agilizando o desenvolvimento.

## 🚀 Guia de Instalação e Execução

Para clonar e executar este projeto em sua máquina local, siga os passos abaixo detalhadamente.

### Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado:

* **Node.js** (versão 18 ou superior) e **npm**: [Faça o download aqui](https://nodejs.org/)
* **Angular CLI:** Instale globalmente com o comando `npm install -g @angular/cli`
* **Git:** [Faça o download aqui](https://git-scm.com/)

### Passo 1: Clonar o Repositório

Abra seu terminal ou prompt de comando, navegue até o diretório onde deseja salvar o projeto e execute o seguinte comando:

```bash
git clone <URL DO PROJETO NO GITHUB>
cd legacy-question-bank
```

### Passo 2: Instalar as Dependências

O projeto é dividido em duas partes (frontend e backend), mas as dependências podem ser instaladas a partir da raiz do projeto.

Execute o comando abaixo na pasta raiz. Ele instalará as dependências listadas no `package.json` principal, que incluem Angular, Express, SQLite, etc.

```bash
npm install
```

### Passo 3: Executar a Aplicação (Modo Fullstack)

Nós configuramos o projeto para que tanto o servidor do Angular (frontend) quanto o servidor Node.js (backend) iniciem com um único comando.

Na pasta raiz do projeto, execute:

```bash
npm run start:fullstack
```
Este comando utiliza a ferramenta concurrently para:

Iniciar o servidor de desenvolvimento do Angular (geralmente na porta 4200).

Iniciar o servidor do backend com nodemon (configurado na porta 3000), que reiniciará automaticamente a cada alteração nos arquivos.

Ao executar, o banco de dados database.sqlite será criado automaticamente dentro da pasta backend/data na primeira vez que o servidor iniciar.

Abra seu navegador e acesse http://localhost:4200. A aplicação estará funcionando, com o frontend se comunicando com o backend na porta 3000.

### Contribuir Passo 1: Criar uma Nova Branch

Nunca faça commits diretamente na branch `master`. Para cada nova funcionalidade, correção de bug ou melhoria, crie uma nova branch a partir da branch principal de desenvolvimento.

Use uma convenção de nomenclatura clara, como:

* Para funcionalidades: `feat/nome-da-funcionalidade` (ex: `feat/question-search-filters`)
* Para correções: `fix/descricao-do-bug` (ex: `fix/login-button-style`)
* Para melhorias: `chore/tipo-de-melhoria` (ex: `chore/update-readme`)

**Comandos:**

```bash
# Certifique-se de estar na branch principal de desenvolvimento
git checkout master

# Puxe as últimas atualizações
git pull origin master

# Crie sua nova branch
git checkout -b feat/nome-da-sua-feature
```

### Passo 2: Desenvolver e Fazer Commits

Faça suas alterações na nova branch. Adicione e faça commits de suas mudanças de forma atômica e com mensagens claras, seguindo o padrão de commits convencionais.

**Exemplo de mensagem de commit:**
feat(questions): Adiciona campo de categoria ao formulário

Implementa o componente de busca de categorias e o integra ao formulário de cadastro de questões, permitindo que o usuário selecione uma categoria existente ou crie uma nova.

### Passo 3: Enviar a Branch e Abrir um Pull Request (PR)

Quando sua funcionalidade estiver completa e testada, envie sua branch para o repositório remoto:

```bash
git push origin feat/nome-da-sua-feature
```

Em seguida, acesse a plataforma Git (GitHub, GitLab, etc.) e abra um Pull Request (ou Merge Request).

De: feat/nome-da-sua-feature

Para: develop

No seu PR, descreva claramente o que foi feito, por que foi feito e, se aplicável, adicione screenshots ou GIFs para demonstrar as mudanças. Marque outros desenvolvedores para revisar seu código.

Após a aprovação e o merge do PR, sua branch poderá ser deletada e o ciclo recomeça para a próxima tarefa.
