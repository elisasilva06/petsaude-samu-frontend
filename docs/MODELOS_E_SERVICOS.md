# Modelos e Services

## 1. Objetivo deste documento

Este documento registra os principais modelos de dados e contratos de services utilizados pelo frontend.

A intenção é facilitar:

* manutenção;
* integração com backend;
* revisão de tipos;
* entendimento da comunicação entre telas e camada de dados;
* redução de inconsistências entre módulos.

---

# 2. Princípio geral

As telas não devem conhecer diretamente a origem dos dados.

Fluxo atual:

```text
Tela
 ↓
Service
 ↓
Mock
```

Fluxo futuro:

```text
Tela
 ↓
Service
 ↓
API
 ↓
Backend
```

Os services funcionam como contratos entre a interface e a fonte dos dados.

---

# 3. Autenticação

## 3.1 LoginInput

Representa os dados enviados durante o login.

```ts
export type LoginInput = {
  email: string;
  senha: string;
};
```

---

## 3.2 UsuarioAutenticado

Representa as informações básicas do usuário autenticado.

```ts
export type UsuarioAutenticado = {
  id: string;
  nome: string;
  email: string;
};
```

---

## 3.3 Sessao

Representa a sessão atual.

```ts
export type Sessao = {
  usuario: UsuarioAutenticado;
};
```

---

## 3.4 AlterarSenhaInput

```ts
export type AlterarSenhaInput = {
  senhaAtual: string;
  novaSenha: string;
};
```

---

## 3.5 SolicitarRecuperacaoSenhaInput

```ts
export type SolicitarRecuperacaoSenhaInput = {
  email: string;
};
```

---

## 3.6 RedefinirSenhaInput

```ts
export type RedefinirSenhaInput = {
  credencialRecuperacao: string;
  novaSenha: string;
};
```

---

## 3.7 Observação sobre autenticação

O frontend ainda não define:

* token;
* refresh token;
* expiração;
* formato de autorização;
* headers;
* estratégia de sessão persistente.

Esses pontos dependem do contrato real do backend.

---

# 4. Perfil profissional

## 4.1 StatusProfissional

```ts
export type StatusProfissional =
  | 'disponivel'
  | 'indisponivel';
```

---

## 4.2 PlantaoProfissional

```ts
export type PlantaoProfissional = {
  inicio: string;
  fim: string;
};
```

---

## 4.3 PerfilProfissional

```ts
export type PerfilProfissional = {
  id: string;

  nome: string;

  email: string;

  cpf: string;

  telefone: string;

  profissao: string;

  conselho: string;

  registro: string;

  uf: string;

  unidade: string;

  areasAtuacao: string[];

  status: StatusProfissional;

  plantao: PlantaoProfissional;
};
```

---

## 4.4 AtualizarPerfilInput

```ts
export type AtualizarPerfilInput = {
  nome: string;

  email: string;

  cpf: string;

  telefone: string;

  profissao: string;

  conselho: string;

  registro: string;

  uf: string;

  unidade: string;

  areasAtuacao: string[];
};
```

---

## 4.5 Observação sobre o perfil

O modelo é multiprofissional.

Não deve assumir valores fixos como:

```text
Médico
CRM
Dr.
Dra.
```

O correto é trabalhar com:

```text
profissao
conselho
registro
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

---

# 5. Cadastro

## 5.1 DadosPessoais

```ts
export type DadosPessoais = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};
```

---

## 5.2 DadosProfissionais

```ts
export type DadosProfissionais = {
  profissao: string;

  conselho: string;

  registro: string;

  uf: string;

  unidade: string;
};
```

---

## 5.3 Áreas de atuação

Atualmente o cadastro mantém uma lista de áreas de atuação no frontend.

Exemplos:

```text
Atendimento Pré-Hospitalar
Urgência e Emergência
Trauma
Pediatria
Obstetrícia
Saúde Mental
Cuidados Respiratórios
Cuidados Intensivos
Reabilitação
Assistência Social
```

Essa lista poderá futuramente ser fornecida pelo backend.

---

# 6. Chamados

## 6.1 StatusChamado

```ts
export type StatusChamado =
  | 'aguardando'
  | 'em_atendimento'
  | 'finalizado'
  | 'cancelado';
```

---

## 6.2 GravidadeChamado

O frontend possui atualmente uma classificação visual temporária.

```ts
export type GravidadeChamado =
  | 'emergencia'
  | 'urgente';
```

Essa classificação não deve ser interpretada como regra clínica definitiva.

A fonte final deve ser o backend/protocolo institucional.

---

## 6.3 ChamadoResumo

Representa os dados necessários para Home e fila.

```ts
export type ChamadoResumo = {
  id: string;

  paciente: string;

  bairro: string;

  classificacao: string;

  gravidade: GravidadeChamado;

  queixa: string;

  prioridade: number;

  status: StatusChamado;

  recebidoEm: string;

  iniciadoEm?: string;

  finalizadoEm?: string;
};
```

---

## 6.4 Chamado

Representa os dados detalhados da ocorrência.

```ts
export type Chamado = {
  id: string;

  paciente: string;

  idade: number;

  sexo: string;

  queixa: string;

  telefone: string;

  bairro: string;

  endereco: string;

  relato: string;

  hospital: string;

  setor: string;

  latitude: number;

  longitude: number;

  fotos: number;
};
```

---

## 6.5 ChamadoDetalhado

Combina os dados clínicos/detalhados com os dados operacionais.

```ts
export type ChamadoDetalhado =
  Chamado &
    Pick<
      ChamadoResumo,
      | 'classificacao'
      | 'gravidade'
      | 'prioridade'
      | 'status'
      | 'recebidoEm'
      | 'iniciadoEm'
      | 'finalizadoEm'
    >;
```

---

## 6.6 PainelChamados

```ts
export type PainelChamados = {
  ativo: ChamadoResumo | null;
  fila: ChamadoResumo[];
};
```

---

# 7. ChamadosService

Contrato atual:

```ts
export interface ChamadosService {
  buscarPainel(): Promise<
    PainelChamados
  >;

  buscarChamado(
    id: string
  ): Promise<
    ChamadoDetalhado
  >;

  listarFinalizados(): Promise<
    ChamadoDetalhado[]
  >;

  aceitarChamado(
    id: string
  ): Promise<
    PainelChamados
  >;

  finalizarChamado(
    id: string
  ): Promise<
    PainelChamados
  >;
}
```

---

## 7.1 buscarPainel

Responsável por retornar:

```text
atendimento ativo
+
fila de ocorrências
```

---

## 7.2 buscarChamado

Busca os dados completos de uma ocorrência.

---

## 7.3 listarFinalizados

Retorna ocorrências cujo status seja:

```text
finalizado
```

Atualmente esse método ajuda a alimentar o Histórico.

---

## 7.4 aceitarChamado

Fluxo:

```text
aguardando
 ↓
em_atendimento
```

---

## 7.5 finalizarChamado

Fluxo:

```text
em_atendimento
 ↓
finalizado
```

A Ficha SAE deve ser validada antes da chamada de finalização.

---

# 8. Estado temporário dos chamados

O `chamadosMockService` mantém estado durante a execução.

Exemplo:

```text
chamados
├── ocorrência 1
├── ocorrência 2
└── ocorrência 3
```

Quando uma ocorrência é aceita:

```text
aguardando
 ↓
em_atendimento
```

Quando é finalizada:

```text
em_atendimento
 ↓
finalizado
```

O objeto continua existindo internamente.

Isso permite:

```text
Home
 ↓
somente aguardando / ativo
```

e:

```text
Histórico
 ↓
finalizados
```

---

# 9. Mensagens

## 9.1 Mensagem

O tipo atual de mensagem inclui informações como:

```ts
{
  id: string;
  autor: string;
  nomeAutor: string;
  texto: string;
  horario: string;
}
```

O tipo exato deve permanecer centralizado em:

```text
features/mensagens/types.ts
```

---

## 9.2 ConversaMensagens

```ts
export type ConversaMensagens = {
  chamadoId: string;

  paciente: string;

  mensagens: Mensagem[];
};
```

---

## 9.3 EnviarMensagemInput

```ts
export type EnviarMensagemInput = {
  chamadoId: string;

  texto: string;

  nomeAutor: string;
};
```

---

# 10. MensagensService

Contrato atual:

```ts
export interface MensagensService {
  buscarConversa(
    chamadoId: string
  ): Promise<
    ConversaMensagens
  >;

  enviarMensagem(
    dados: EnviarMensagemInput
  ): Promise<
    Mensagem
  >;
}
```

---

## 10.1 buscarConversa

Retorna a conversa de uma ocorrência específica.

---

## 10.2 enviarMensagem

Adiciona uma nova mensagem à conversa.

No mock atual, as mensagens são separadas por:

```text
chamadoId
```

---

# 11. Armazenamento temporário das mensagens

Atualmente é utilizado um:

```ts
Map<string, Mensagem[]>
```

Conceitualmente:

```text
1 → mensagens da ocorrência 1
2 → mensagens da ocorrência 2
3 → mensagens da ocorrência 3
```

Isso impede que conversas diferentes sejam misturadas.

---

# 12. Ficha SAE

## 12.1 StatusFichaSae

```ts
export type StatusFichaSae =
  | 'nao_iniciada'
  | 'em_preenchimento'
  | 'concluida';
```

---

# 13. FichaSaeService

Contrato operacional atual:

```ts
export interface FichaSaeService {
  buscarStatus(
    chamadoId: string
  ): Promise<
    StatusFichaSae
  >;

  marcarEmPreenchimento(
    chamadoId: string
  ): Promise<void>;

  marcarComoConcluida(
    chamadoId: string
  ): Promise<void>;
}
```

---

## 13.1 buscarStatus

Permite verificar se a ficha está:

```text
não iniciada
em preenchimento
concluída
```

---

## 13.2 marcarEmPreenchimento

Executado quando o usuário inicia o preenchimento.

---

## 13.3 marcarComoConcluida

Executado após confirmação de conclusão.

Esse status é utilizado pelo fluxo de finalização da ocorrência.

---

# 14. Evolução prevista da Ficha SAE

Quando a estrutura definitiva estiver consolidada, o service poderá evoluir para algo semelhante a:

```ts
interface FichaSaeService {
  buscarRascunho(
    chamadoId: string
  ): Promise<
    FichaSaeState | null
  >;

  salvarRascunho(
    chamadoId: string,
    ficha: FichaSaeState
  ): Promise<void>;

  concluir(
    chamadoId: string,
    ficha: FichaSaeState
  ): Promise<void>;
}
```

Essa estrutura ainda não deve ser tratada como contrato definitivo.

Ela depende da revisão completa dos tipos da Ficha SAE e do backend.

---

# 15. Histórico

## 15.1 HistoricoAtendimento

```ts
export type HistoricoAtendimento = {
  id: string;

  paciente: string;

  idade: number;

  sexo: string;

  data: string;

  horario: string;

  tipoOcorrencia: string;

  classificacao: string;

  endereco: string;

  hospitalDestino: string;

  profissional: string;

  status: 'finalizado';
};
```

---

# 16. HistoricoService

Contrato atual:

```ts
export interface HistoricoService {
  listarAtendimentos(): Promise<
    HistoricoAtendimento[]
  >;

  buscarAtendimento(
    id: string
  ): Promise<
    HistoricoAtendimento
  >;
}
```

---

## 16.1 listarAtendimentos

Retorna atendimentos finalizados.

No mock atual, o resultado pode incluir:

```text
registros históricos antigos
+
ocorrências finalizadas durante a execução
```

---

## 16.2 buscarAtendimento

Busca um atendimento específico pelo ID.

A lista e os detalhes utilizam a mesma fonte para evitar inconsistência.

---

# 17. Conversão de Chamado para Histórico

Durante o protótipo, uma ocorrência finalizada pode ser convertida para `HistoricoAtendimento`.

Exemplo conceitual:

```text
ChamadoDetalhado
 ↓
converterChamadoParaHistorico()
 ↓
HistoricoAtendimento
```

Essa conversão é temporária.

No sistema real, o ideal é que o backend forneça o registro histórico já consolidado.

---

# 18. Campos temporários do Histórico

Alguns campos ainda dependem do contrato real do backend.

Exemplos:

```text
tipoOcorrencia
profissional responsável
hospital de destino
```

Durante o protótipo, alguns desses valores são derivados de dados disponíveis no mock.

Eles não devem ser tratados como definição definitiva da API.

---

# 19. Contexts e services

Nem toda funcionalidade acessa service diretamente pela tela.

Exemplo do Perfil:

```text
EditarPerfilScreen
 ↓
PerfilContext
 ↓
perfilService
```

Exemplo do Auth:

```text
Login
 ↓
AuthContext
 ↓
authService
```

Essa camada extra é utilizada quando existe estado compartilhado.

---

# 20. Regra de fonte única

Sempre que possível, deve existir apenas uma fonte principal para determinado estado.

Exemplo:

```text
chamadosMockService
        ↓
estado dos chamados
      /            \
   Home          Histórico
```

Evitar:

```text
Home → mock A

Histórico → mock B
```

quando os dois representam o mesmo atendimento.

Isso reduz inconsistências.

---

# 21. Tipos e backend

Os tipos atuais representam as necessidades do frontend.

Eles não devem obrigar o backend a utilizar exatamente o mesmo formato.

Na integração futura poderá existir:

```text
DTO do backend
 ↓
Mapper
 ↓
Tipo utilizado pelo frontend
```

Exemplo:

```text
ChamadoApiResponse
 ↓
mapearChamado()
 ↓
ChamadoDetalhado
```

Isso permite manter as telas estáveis mesmo se os nomes dos campos da API forem diferentes.

---

# 22. Regra importante sobre APIs

Enquanto o contrato real não estiver disponível, não devem ser criados valores fictícios como:

```text
/api/chamados
/api/login
/api/ficha-sae
accessToken
refreshToken
socketUrl
```

apenas para antecipar a integração.

Esses contratos precisam vir da equipe responsável pelo backend.

---

# 23. Resumo dos principais services

| Service          | Responsabilidade               |
| ---------------- | ------------------------------ |
| AuthService      | Autenticação e senha           |
| CadastroService  | Cadastro do profissional       |
| PerfilService    | Perfil profissional            |
| ChamadosService  | Fila e atendimento             |
| MensagensService | Conversa da ocorrência         |
| FichaSaeService  | Estado e conteúdo da Ficha SAE |
| HistoricoService | Atendimentos finalizados       |

---

# 24. Objetivo final

A organização atual permite evoluir de:

```text
Frontend
 ↓
Mocks
```

para:

```text
Frontend
 ↓
Services
 ↓
API Services
 ↓
Backend
```

mantendo as telas e os principais fluxos com o menor número possível de alterações.
