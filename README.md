# SAMU — Aplicativo da Equipe Multidisciplinar

Frontend mobile desenvolvido com **React Native, Expo e TypeScript** para apoiar o fluxo de atendimento de uma equipe multidisciplinar do SAMU.

> Projeto acadêmico em desenvolvimento. O frontend utiliza atualmente dados mockados e está estruturado para integração futura com o backend.

---

## Sobre o projeto

O aplicativo permite que profissionais da equipe multidisciplinar acompanhem uma ocorrência desde sua chegada à fila até a finalização do atendimento.

Fluxo principal:

```text
Login
 ↓
Home
 ↓
Fila de ocorrências
 ↓
Detalhes da ocorrência
 ↓
Aceitar atendimento
 ↓
Atendimento em andamento
 ├── Mensagens
 ├── Ficha SAE
 └── Finalização
        ↓
     Histórico
        ↓
     Detalhes do atendimento
```

---

## Funcionalidades

### Autenticação

* Splash inicial
* Login
* Logout
* Recuperação de senha
* Redefinição de senha
* Alteração de senha

### Cadastro

Cadastro dividido em etapas:

* dados pessoais;
* dados profissionais;
* áreas de atuação.

O aplicativo utiliza um modelo multiprofissional e não assume que todos os profissionais sejam médicos.

Exemplos:

* Enfermagem — COREN
* Fisioterapia — CREFITO
* Medicina — CRM

### Home

A Home funciona como painel operacional e apresenta:

* dados do profissional;
* plantão;
* status;
* atendimento em andamento;
* fila de ocorrências.

### Ocorrências

O profissional pode:

* visualizar os detalhes de uma ocorrência;
* aceitar um atendimento;
* acompanhar o atendimento ativo;
* acessar mensagens;
* preencher a Ficha SAE;
* finalizar a ocorrência.

Estados atualmente utilizados:

```ts
'aguardando'
'em_atendimento'
'finalizado'
'cancelado'
```

### Mensagens

Cada ocorrência possui sua própria conversa.

O módulo permite:

* visualizar mensagens;
* enviar mensagens;
* identificar autor;
* visualizar horário;
* manter conversas separadas por ocorrência.

Atualmente, as mensagens são armazenadas temporariamente no frontend.

### Ficha SAE

A Ficha SAE está vinculada a uma ocorrência em atendimento.

Ela possui dez etapas:

1. Identificação
2. Avaliação Primária
3. Avaliação Secundária
4. Escala de Glasgow
5. Escala RASS
6. Escala TRIPS
7. Trauma e Queimaduras
8. Escala de Morse
9. Diagnósticos e Intervenções
10. Finalização

Status atuais:

```ts
'nao_iniciada'
'em_preenchimento'
'concluida'
```

A ocorrência só pode ser finalizada depois da conclusão da Ficha SAE.

### Histórico

Os atendimentos finalizados são disponibilizados no Histórico.

Filtros atuais:

* Todos
* Hoje
* Semana
* Mês

Cada atendimento pode ser aberto para visualização dos detalhes.

### Perfil

O perfil profissional possui:

* nome;
* e-mail;
* CPF;
* telefone;
* profissão;
* conselho profissional;
* registro;
* UF;
* unidade;
* áreas de atuação;
* status;
* plantão.

O usuário também pode editar seus dados.

---

## Tecnologias

O projeto utiliza:

* React Native
* Expo SDK 54
* TypeScript
* Expo Router
* React Context API
* Ionicons

O projeto foi iniciado com `create-expo-app`.

---

## Arquitetura

O frontend foi organizado para evitar dependência direta entre as telas e os mocks.

Estrutura adotada:

```text
Tela
 ↓
Context / Hook, quando necessário
 ↓
Service
 ↓
Mock atualmente
 ↓
API futuramente
```

Exemplo atual:

```text
Home
 ↓
chamadosService
 ↓
chamadosMockService
```

Futuramente:

```text
Home
 ↓
chamadosService
 ↓
chamadosApiService
 ↓
Backend
```

Essa organização permite substituir os mocks pela API sem reconstruir as telas.

---

## Estrutura principal

```text
samu-app/
├── app/
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── historico.tsx
│   │   └── perfil.tsx
│   │
│   ├── cadastro/
│   ├── chamado/
│   ├── mensagens/
│   ├── ficha-sae/
│   ├── detalhesHistorico/
│   ├── editar-perfil.tsx
│   ├── alterar-senha.tsx
│   ├── esqueci-senha.tsx
│   ├── nova-senha.tsx
│   └── index.tsx
│
├── assets/
├── components/
├── constants/
├── contexts/
│
├── features/
│   ├── auth/
│   ├── cadastro/
│   ├── chamados/
│   ├── ficha-sae/
│   ├── mensagens/
│   ├── historico/
│   └── perfil/
│
├── hooks/
├── services/
├── docs/
├── package.json
└── README.md
```

---

# Como executar o projeto

## 1. Instale as dependências

```bash
npm install
```

## 2. Inicie o Expo

```bash
npx expo start
```

Após iniciar, o Expo disponibilizará opções para executar o projeto em:

* dispositivo físico com Expo Go;
* Android Emulator;
* iOS Simulator;
* navegador Web.

A documentação oficial do Expo está disponível em:

https://docs.expo.dev/

---

## Verificação de TypeScript

Para verificar erros de TypeScript sem gerar arquivos:

```bash
npx tsc --noEmit
```

---

# Desenvolvimento atual

O backend está sendo desenvolvido separadamente.

Por isso, o frontend utiliza services e mocks para permitir o desenvolvimento e teste das funcionalidades.

Atualmente é possível testar o fluxo:

```text
Login
 ↓
Home
 ↓
Selecionar ocorrência
 ↓
Aceitar
 ↓
Atendimento ativo
 ├── Mensagens
 └── Ficha SAE
        ↓
     Concluir ficha
        ↓
Finalizar ocorrência
 ↓
Histórico
 ↓
Detalhes do atendimento
```

---

# Integração com backend

Antes da integração, será necessário receber da equipe responsável:

* URL da API;
* documentação dos endpoints;
* autenticação;
* requests e responses;
* regras de negócio;
* códigos de erro;
* paginação;
* permissões;
* contratos da Ficha SAE;
* funcionamento das mensagens.

Preferencialmente, essas informações devem ser disponibilizadas por Swagger/OpenAPI ou documentação equivalente.

O frontend não deve inventar antecipadamente:

* endpoints;
* tokens;
* payloads;
* regras clínicas;
* WebSocket;
* formatos de documentos.

---

# Documentação

A documentação técnica está disponível na pasta `docs`.

### Arquitetura do Frontend

[`docs/ARQUITETURA_FRONTEND.md`](docs/ARQUITETURA_FRONTEND.md)

Explica a organização entre telas, contexts, services, mocks e futura API.

### Fluxos

[`docs/FLUXOS.md`](docs/FLUXOS.md)

Documenta os principais fluxos de navegação e atendimento.

### Telas e Funcionalidades

[`docs/TELAS_E_FUNCIONALIDADES.md`](docs/TELAS_E_FUNCIONALIDADES.md)

Apresenta as responsabilidades e funcionalidades de cada tela.

### Modelos e Services

[`docs/MODELOS_E_SERVICOS.md`](docs/MODELOS_E_SERVICOS.md)

Registra os principais tipos e contratos internos do frontend.

### Integração com Backend

[`docs/INTEGRACAO_BACKEND.md`](docs/INTEGRACAO_BACKEND.md)

Documenta o que será necessário para substituir os mocks pela API real.

### Testes e Checklist

[`docs/TESTES_E_CHECKLIST.md`](docs/TESTES_E_CHECKLIST.md)

Contém os testes manuais e verificações técnicas recomendadas.

---

# Segurança

Como o sistema poderá manipular informações pessoais e relacionadas a atendimentos:

* credenciais não devem ser adicionadas ao repositório;
* arquivos `.env` com secrets não devem ser versionados;
* dados sensíveis não devem ser registrados desnecessariamente em logs;
* documentos clínicos não devem ser expostos publicamente;
* regras de autorização também devem existir no backend.

---

# Próximos passos

* revisão final do frontend;
* remoção de código legado;
* revisão dos tipos da Ficha SAE;
* persistência de rascunho da Ficha SAE;
* integração com backend;
* persistência real das mensagens;
* histórico persistente;
* possível comunicação em tempo real;
* geração futura da Ficha SAE em PDF;
* ampliação dos testes.

---

## Status do projeto

O frontend possui atualmente uma **base funcional do fluxo principal**, utilizando mocks e uma arquitetura preparada para futura integração com o backend.
