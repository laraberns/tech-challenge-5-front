# AjudaNaTask

## Descrição do Projeto

AjudaNaTask é uma plataforma web para a gestão de times e tarefas, focada na atribuição e monitoramento de atividades. A aplicação é desenvolvida com um front-end reativo utilizando Next.js, integração com Firebase para armazenamento e autenticação, e um back-end em Node.js para gerenciar interações com o banco de dados.

### Funcionalidades

- **Cadastro de Membros do Time:** Permite registrar membros do time com informações como nome, e-mail e função.
  
- **Gestão de Tarefas:** Os usuários podem criar tarefas, definindo descrição, prazos, prioridades e tempo estimado para conclusão.
  
- **Atribuição de Tarefas:** Associa tarefas aos membros do time, permitindo múltiplas tarefas por membro.
  
- **Cálculo de Alocação de Tempo:** Calcula automaticamente o total de horas alocadas para cada membro, considerando todas as tarefas atribuídas.
  
- **Notificações de Prazo:** Implementa um sistema de notificações com Firebase para alertar sobre tarefas próximas do prazo final.

### Front-End

O front-end é desenvolvido em Next.js, proporcionando uma interface intuitiva e interativa para visualizar e gerenciar membros e tarefas do time. Inclui visualizações que mostram a carga de trabalho de cada membro e o status das tarefas.

### Back-End

O back-end consiste em uma API Node.js que gerencia as operações CRUD (Criar, Ler, Atualizar, Deletar) para membros do time e tarefas. Esta API interage com o Firebase Firestore para armazenamento de dados.

### Firebase

Utiliza o Firestore para armazenamento de dados de usuários, membros do time e tarefas. Implementa a autenticação de usuários com Firebase Authentication e utiliza Firebase Functions para enviar notificações de tarefas próximas do prazo.

## Instruções para Rodar o Projeto

1. Clone o repositório do front-end:
 ```js
git clone https://github.com/laraberns/tech-challenge-5-front.git
 ```
 
2. Na pasta `tech-challenge-5-front`, instale as dependências:
 ```js
npm install
 ```

3. Adicione um arquivo `next.config.js` com suas chaves do Firebase:
```js
module.exports = {
  env: {
    FIREBASE_API_KEY: "sua-api-key",
    FIREBASE_AUTH_DOMAIN: "seu-auth-domain.firebaseapp.com",
    FIREBASE_PROJECT_ID: "seu-project-id",
    FIREBASE_STORAGE_BUCKET: "seu-storage-bucket.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "seu-messaging-sender-id",
    FIREBASE_APP_ID: "seu-app-id",
    FIREBASE_FCM_VAPID_KEY: "sua-fcm-vapid-key",
    BD_API: "seuBancoDeDadosAPI"
  },
};
```

4. Na pasta `tech-challenge-5-front`, rode o projeto front-end:
 ```js
npm run dev
 ```

5. Acesse a tela de login:
 ```js
"http://localhost:3000/login"
 ```

6. Clone o repositório do backend dentro do seu diretório:
 ```js
git clone https://github.com/laraberns/tech-challenge-5-back.git
 ```

7. No Firebase Console, siga as etapas abaixo para configurar o serviço e as notificações:
- Acesse as Configurações do Projeto no Firebase Console.
- Vá para Contas de Serviço e gere uma nova chave privada. Isso criará um arquivo JSON que você deve nomear como creds.json.
- Coloque o arquivo creds.json na pasta raiz do projeto backend (tech-challenge-5-back) E também dentro da pasta functions.

8. Rode o servidor Node.js::
 ```js
node server.js
 ```

Para configurar o envio de notificações:

9. Instale as dependências necessárias::
 ```js
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
 ```

10. Faça login no Firebase:
 ```js
firebase login
 ```

11. Inicialize o Firebase Functions dentro da pasta functions:
 ```js
firebase init functions
 ```

12. Deploy das funções para o Firebase:
 ```js
firebase deploy --only functions
 ```

Este README fornece uma visão geral do projeto AjudaNaTask, detalhando suas funcionalidades, tecnologias utilizadas e instruções para executar localmente.
