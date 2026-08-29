# Arquitetura do Frontend

## 1. Visão geral

O frontend do aplicativo SAMU foi organizado para permitir que a equipe desenvolva e teste as funcionalidades mesmo antes da integração definitiva com o backend.

A arquitetura foi estruturada para evitar que as telas dependam diretamente de dados mockados ou de chamadas HTTP.

O fluxo adotado é:

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

Essa organização facilita a substituição dos mocks pelos serviços reais quando o backend estiver disponível.

---

## 2. Tecnologias principais

O frontend utiliza atualmente:

* React Native
* Expo SDK 54
* TypeScript
* Expo Router
* Context API
* Ionicons

O projeto foi criado utilizando `create-expo-app`.

---

## 3. Organização por funcionalidades

O código é separado por domínio dentro da pasta `features`.

Estrutura principal:

```text
features/
├── auth/
├── cadastro/
├── chamados/
├── ficha-sae/
├── mensagens/
├── historico/
└── perfil/
```

Cada funcionalidade pode possuir seus próprios:

* tipos;
* services;
* mocks;
* contexts;
* componentes;
* mappers;
* sections.

Essa organização evita concentrar toda a lógica do sistema dentro das telas.

---

## 4. Responsabilidade das telas

As telas são responsáveis principalmente pela interface e pela interação com o usuário.

Uma tela pode:

* exibir dados;
* controlar estados visuais;
* mostrar loading;
* mostrar erros;
* navegar entre rotas;
* chamar services;
* utilizar Context quando necessário.

Uma tela não deve:

* acessar mocks diretamente;
* realizar `fetch` diretamente;
* criar contratos de API;
* inventar endpoints;
* inventar tokens;
* duplicar regras já existentes nos services.

Exemplo incorreto:

```text
Tela
 ↓
Mock
```

Exemplo correto:

```text
Tela
 ↓
Service
 ↓
Mock
```

Futuramente:

```text
Tela
 ↓
Service
 ↓
API
```

---

## 5. Services

Os services funcionam como uma camada intermediária entre as telas e a fonte dos dados.

Exemplo conceitual:

```ts
export interface ChamadosService {
  buscarPainel(): Promise<PainelChamados>;

  buscarChamado(
    id: string
  ): Promise<ChamadoDetalhado>;

  listarFinalizados(): Promise<
    ChamadoDetalhado[]
  >;

  aceitarChamado(
    id: string
  ): Promise<PainelChamados>;

  finalizarChamado(
    id: string
  ): Promise<PainelChamados>;
}
```

Atualmente:

```text
chamadosService
 ↓
chamadosMockService
```

No futuro:

```text
chamadosService
 ↓
chamadosApiService
 ↓
Backend
```

Dessa forma, as telas podem continuar utilizando o mesmo contrato.

---

## 6. Contexts

Context é utilizado quando uma informação precisa ser compartilhada entre várias telas ou componentes.

### AuthContext

Responsável pela sessão global do usuário.

Exemplos:

* usuário autenticado;
* login;
* logout;
* estado da sessão.

### CadastroContext

Armazena temporariamente os dados durante o fluxo de cadastro em múltiplas etapas.

### PerfilContext

Centraliza informações relacionadas ao profissional.

Responsabilidades:

* carregar perfil;
* armazenar perfil;
* atualizar dados;
* recarregar informações;
* disponibilizar loading e erro.

### FichaSaeContext

Centraliza o estado das diferentes seções da Ficha SAE.

Isso evita que cada seção mantenha uma cópia separada dos dados.

---

## 7. Rotas principais

O projeto utiliza Expo Router.

### Abas principais

```text
/(tabs)/home
/(tabs)/historico
/(tabs)/perfil
```

As três abas principais são:

* Início
* Histórico
* Perfil

### Rotas operacionais

```text
/chamado/[id]
/mensagens/[id]
/ficha-sae/[id]
/detalhesHistorico/[id]
```

O `[id]` identifica a ocorrência relacionada àquela tela.

Exemplo:

```text
/chamado/1
/mensagens/1
/ficha-sae/1
```

Todas correspondem à ocorrência de ID `1`.

### Outras rotas

```text
/
/esqueci-senha
/nova-senha
/alterar-senha
/editar-perfil
/cadastro/*
```

---

## 8. Modelo operacional dos chamados

O mock atual possui estado.

Um chamado pode assumir os seguintes estados:

```text
aguardando
 ↓
em_atendimento
 ↓
finalizado
```

Também existe suporte ao estado:

```text
cancelado
```

Fluxo principal:

```text
Fila
 ↓
Aceitar ocorrência
 ↓
Atendimento ativo
 ↓
Finalizar
 ↓
Histórico
```

Quando uma ocorrência é finalizada, ela deixa de aparecer na Home, mas continua armazenada para alimentar o Histórico.

---

## 9. Fila de prioridade

A Home possui uma fila de ocorrências aguardando atendimento.

A ordenação temporária utiliza:

1. prioridade;
2. horário de recebimento.

Exemplo:

```text
Prioridade 1
 ↓
Prioridade 2
 ↓
Prioridade 3
```

Quando duas ocorrências possuem a mesma prioridade, a mais antiga aparece primeiro.

Essa regra é temporária.

A prioridade clínica definitiva deverá ser definida pelo backend e pelos protocolos oficiais utilizados pelo sistema.

---

## 10. Atendimento ativo

No protótipo atual, um profissional pode possuir apenas um atendimento ativo por vez.

Fluxo:

```text
Fila
 ↓
Aceitar
 ↓
Atendimento ativo
```

Enquanto existe um atendimento ativo:

* outras ocorrências permanecem na fila;
* detalhes das outras ocorrências ainda podem ser consultados;
* um novo chamado não substitui automaticamente o atendimento atual.

Essa regra deverá ser confirmada pelo backend.

---

## 11. Mensagens

Cada conversa é vinculada a uma ocorrência.

Exemplo:

```text
Ocorrência 1
 ↓
Conversa 1

Ocorrência 2
 ↓
Conversa 2
```

As mensagens são acessadas através de:

```text
MensagensScreen
 ↓
mensagensService
 ↓
mensagensMockService
```

Atualmente, as mensagens permanecem apenas durante a execução da aplicação.

Futuramente, deverão ser persistidas pelo backend.

---

## 12. Ficha SAE

A Ficha SAE está vinculada à ocorrência ativa.

Fluxo:

```text
Ocorrência ativa
 ↓
Ficha SAE
 ↓
Preenchimento
 ↓
Conclusão
```

O status operacional atual pode ser:

```text
nao_iniciada
em_preenchimento
concluida
```

A finalização da ocorrência depende da conclusão da Ficha SAE.

O frontend faz essa verificação para melhorar a experiência do usuário, mas o backend também deverá validar essa regra.

---

## 13. Histórico

O Histórico utiliza registros finalizados.

Fluxo:

```text
finalizarChamado()
 ↓
status = finalizado
 ↓
historicoService
 ↓
Histórico
```

A lista e os detalhes utilizam a mesma fonte de dados para evitar inconsistências.

---

## 14. Perfil multiprofissional

O aplicativo não deve assumir que todo profissional da equipe é médico.

Por isso, o modelo utiliza:

```text
profissao
conselho
registro
uf
unidade
areasAtuacao
```

Exemplos:

```text
Enfermagem
COREN
```

```text
Fisioterapia
CREFITO
```

```text
Medicina
CRM
```

Não devem ser utilizados títulos fixos como:

```text
Dr.
Dra.
Médico
CRM
```

quando o campo se refere ao profissional autenticado de forma genérica.

---

## 15. Preparação para o backend

Enquanto o contrato do backend não estiver disponível, o frontend não deve inventar:

* endpoints;
* tokens;
* refresh tokens;
* formatos de autenticação;
* payloads;
* regras clínicas;
* mecanismos de WebSocket;
* contratos de arquivos.

Esses elementos deverão ser implementados quando a documentação real do backend estiver disponível.

---

## 16. Padrão de comentários

O projeto utiliza comentários apenas quando ajudam a explicar arquitetura ou decisões importantes.

Utilizar JSDoc:

```ts
/**
 * Busca os dados da ocorrência.
 */
```

Utilizar comentários curtos apenas quando a decisão não for óbvia.

Para integrações futuras:

```ts
TODO(BACKEND):
```

Exemplo:

```ts
/**
 * TODO(BACKEND):
 * Substituir o mock pelo service da API.
 */
```

---

## 17. Objetivo da arquitetura

A principal ideia da estrutura atual é permitir esta evolução:

```text
HOJE

Tela
 ↓
Service
 ↓
Mock
```

para:

```text
FUTURO

Tela
 ↓
Service
 ↓
API
 ↓
Backend
```

sem precisar reconstruir todas as telas quando a integração com o backend começar.
