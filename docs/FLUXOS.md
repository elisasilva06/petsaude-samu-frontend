# Fluxos do Sistema

## 1. Visão geral

Este documento descreve os principais fluxos de navegação e funcionamento do frontend do aplicativo SAMU.

O objetivo é deixar claro como o usuário percorre o sistema e como as principais funcionalidades se conectam.

Fluxo geral:

```text
Entrada
 ↓
Login
 ↓
Home
 ↓
Ocorrência
 ↓
Atendimento
 ↓
Ficha SAE
 ↓
Finalização
 ↓
Histórico
```

---

## 2. Fluxo de entrada

Ao abrir o aplicativo:

```text
Aplicativo iniciado
 ↓
Splash
 ↓
Login
```

A Splash é exibida temporariamente antes da tela de autenticação.

Depois disso, o usuário pode:

```text
Login
 ├── Entrar
 ├── Esqueci minha senha
 └── Criar cadastro
```

---

## 3. Fluxo de login

```text
Login
 ↓
Informar e-mail
 ↓
Informar senha
 ↓
Validar dados
 ↓
Autenticar
 ↓
Criar sessão
 ↓
Home
```

A sessão é mantida através do `AuthContext`.

Atualmente, a autenticação utiliza dados temporários do frontend.

Quando o backend estiver disponível, a autenticação real será executada pelo service correspondente.

---

## 4. Recuperação de senha

O fluxo atual é:

```text
Login
 ↓
Esqueci minha senha
 ↓
Informar e-mail
 ↓
Solicitar recuperação
 ↓
Nova senha
 ↓
Redefinir senha
 ↓
Login
```

A interface evita indicar se determinado e-mail existe ou não no sistema.

Essa decisão ajuda a evitar exposição indevida de contas cadastradas.

---

## 5. Cadastro

O cadastro é dividido em etapas.

```text
Cadastro
 ↓
Dados pessoais
 ↓
Dados profissionais
 ↓
Áreas de atuação
 ↓
Cadastro concluído
```

### Etapa 1 — Dados pessoais

Campos:

```text
Nome
E-mail
CPF
Telefone
```

### Etapa 2 — Dados profissionais

Campos:

```text
Profissão
Conselho profissional
Registro
UF
Unidade
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

### Etapa 3 — Áreas de atuação

O usuário pode selecionar uma ou mais áreas.

Exemplos:

```text
Urgência e Emergência
Trauma
Pediatria
Saúde Mental
Cuidados Respiratórios
Reabilitação
```

---

## 6. Navegação principal

Após a autenticação, o aplicativo possui três abas principais:

```text
Início
Histórico
Perfil
```

Representadas pelas rotas:

```text
/(tabs)/home
/(tabs)/historico
/(tabs)/perfil
```

---

# 7. Fluxo da Home

A Home funciona como painel operacional.

Ela apresenta:

```text
Profissional
 ↓
Plantão atual
 ↓
Status
 ↓
Atendimento ativo
 ↓
Fila de prioridade
```

Existem dois estados principais.

---

## 7.1 Sem atendimento ativo

```text
Home
 ↓
Nenhum atendimento ativo
 ↓
Fila disponível
 ↓
Escolher ocorrência
 ↓
Abrir detalhes
```

O profissional pode analisar uma ocorrência antes de aceitá-la.

---

## 7.2 Com atendimento ativo

```text
Home
 ↓
Atendimento em andamento
 ↓
Continuar atendimento
```

Enquanto existe um chamado ativo:

* ele aparece separado da fila;
* outras ocorrências continuam aguardando;
* os detalhes das outras ocorrências ainda podem ser visualizados;
* outro chamado não pode ser aceito no protótipo atual.

---

# 8. Fluxo da fila de prioridade

O mock atual ordena os chamados por:

```text
1. prioridade
2. horário de recebimento
```

Exemplo:

```text
Ocorrência A
Prioridade 1
14:20

Ocorrência B
Prioridade 2
14:35

Ocorrência C
Prioridade 2
14:42
```

Resultado:

```text
1º Ocorrência A
2º Ocorrência B
3º Ocorrência C
```

Entre ocorrências com a mesma prioridade, a mais antiga aparece primeiro.

Essa é uma lógica temporária de frontend.

A regra real de classificação e prioridade deverá vir do backend/protocolo institucional.

---

# 9. Fluxo de detalhes da ocorrência

Ao selecionar uma ocorrência:

```text
Home
 ↓
Detalhes da ocorrência
```

A tela pode apresentar informações como:

```text
Paciente
Idade
Sexo
Queixa
Telefone
Bairro
Endereço
Relato
Hospital
Setor
Localização
Classificação
Prioridade
Status
```

---

## 9.1 Ocorrência aguardando

Quando o status é:

```text
aguardando
```

o fluxo é:

```text
Detalhes
 ↓
Aceitar ocorrência
 ↓
chamadosService
 ↓
status = em_atendimento
 ↓
Atendimento iniciado
```

---

## 9.2 Ocorrência em atendimento

Quando o status é:

```text
em_atendimento
```

a tela passa a disponibilizar:

```text
Atendimento em andamento
 ├── Mensagens
 ├── Ficha SAE
 └── Finalizar ocorrência
```

---

# 10. Fluxo de mensagens

As mensagens pertencem a uma ocorrência específica.

```text
Ocorrência ativa
 ↓
Mensagens
 ↓
Conversa da ocorrência
```

Exemplo:

```text
Ocorrência #1
 ↓
Conversa #1
```

e:

```text
Ocorrência #2
 ↓
Conversa #2
```

As mensagens não devem se misturar entre ocorrências.

Fluxo de envio:

```text
Digitar mensagem
 ↓
mensagensService.enviarMensagem()
 ↓
Mensagem salva no mock
 ↓
Mensagem aparece na conversa
```

No mock atual, a conversa permanece enquanto a aplicação estiver em execução.

Futuramente:

```text
MensagensScreen
 ↓
mensagensService
 ↓
API / sistema em tempo real
 ↓
Backend
```

---

# 11. Fluxo da Ficha SAE

A Ficha SAE é acessada a partir de uma ocorrência em andamento.

```text
Ocorrência ativa
 ↓
Ficha SAE
```

A rota é:

```text
/ficha-sae/[id]
```

O `id` corresponde à ocorrência.

---

## 11.1 Seções da Ficha SAE

A ficha possui atualmente dez etapas:

```text
01 Identificação
02 Avaliação Primária
03 Avaliação Secundária
04 Escala de Glasgow
05 Escala RASS
06 Escala TRIPS
07 Trauma e Queimaduras
08 Escala de Morse
09 Diagnósticos e Intervenções
10 Finalização
```

Navegação:

```text
Etapa 1
 ↓
Próxima
 ↓
Etapa 2
 ↓
Próxima
 ↓
...
 ↓
Etapa 10
```

Também é possível navegar pelas seções superiores.

---

## 11.2 Status da Ficha SAE

A ficha pode possuir:

```text
nao_iniciada
 ↓
em_preenchimento
 ↓
concluida
```

Quando a tela é acessada durante um atendimento:

```text
Ficha aberta
 ↓
marcarEmPreenchimento()
```

Ao concluir:

```text
Concluir Ficha
 ↓
Modal de confirmação
 ↓
Confirmar
 ↓
marcarComoConcluida()
 ↓
status = concluida
 ↓
Voltar para ocorrência
```

---

# 12. Fluxo de finalização da ocorrência

A ocorrência não deve ser finalizada antes da conclusão da Ficha SAE.

Fluxo:

```text
Atendimento ativo
 ↓
Finalizar ocorrência
 ↓
Consultar status da Ficha SAE
```

Existem dois caminhos.

---

## 12.1 Ficha SAE não concluída

```text
Finalizar ocorrência
 ↓
Ficha SAE não concluída
 ↓
Bloquear finalização
 ↓
Ir para Ficha SAE
```

O usuário precisa concluir a ficha antes de continuar.

---

## 12.2 Ficha SAE concluída

```text
Finalizar ocorrência
 ↓
Ficha SAE concluída
 ↓
Modal de confirmação
 ↓
Confirmar
 ↓
chamadosService.finalizarChamado()
 ↓
status = finalizado
```

Depois disso:

```text
Ocorrência sai da Home
 ↓
Atendimento ativo fica vazio
 ↓
Ocorrência passa para o Histórico
```

---

# 13. Fluxo do Histórico

A aba Histórico apresenta atendimentos finalizados.

```text
Finalização
 ↓
status = finalizado
 ↓
historicoService
 ↓
Histórico
```

A tela recarrega os dados quando recebe foco.

Isso permite o fluxo:

```text
Finalizar ocorrência
 ↓
Voltar para Home
 ↓
Abrir Histórico
 ↓
Ocorrência recém-finalizada aparece
```

---

## 13.1 Filtros

Os filtros atuais são:

```text
Todos
Hoje
Semana
Mês
```

Eles são aplicados no frontend.

Futuramente, o backend poderá oferecer filtros e paginação.

---

# 14. Fluxo dos detalhes do Histórico

Ao selecionar um atendimento:

```text
Histórico
 ↓
Selecionar atendimento
 ↓
/detalhesHistorico/[id]
 ↓
historicoService.buscarAtendimento(id)
 ↓
Detalhes
```

A tela apresenta:

```text
Status
Classificação
Paciente
Idade
Sexo
Data
Horário
Tipo da ocorrência
Endereço
Hospital de destino
Profissional responsável
```

Existe também uma área reservada para o registro da Ficha SAE.

---

# 15. Ficha SAE no Histórico

O fluxo futuro previsto é:

```text
Histórico
 ↓
Detalhes do Atendimento
 ↓
Ficha SAE
 ↓
Visualizar registro
```

Também poderá existir futuramente:

```text
Visualizar PDF
```

A geração do PDF foi adiada.

Quando implementada, a preferência arquitetural é que o backend gere o documento final.

---

# 16. Fluxo do Perfil

Na aba Perfil:

```text
Perfil
 ↓
Visualizar dados profissionais
 ↓
Editar Perfil
```

---

## 16.1 Edição do perfil

Fluxo:

```text
Perfil
 ↓
Editar Perfil
 ↓
Alterar dados
 ↓
Validar formulário
 ↓
PerfilContext.atualizarPerfil()
 ↓
Dados salvos
 ↓
Voltar ao Perfil
```

Campos:

```text
Nome
E-mail
CPF
Telefone
Profissão
Conselho
Registro
UF
Unidade
Áreas de atuação
```

---

# 17. Fluxo multiprofissional

O aplicativo não é exclusivo para médicos.

O profissional autenticado pode pertencer a diferentes categorias.

Exemplos:

```text
Enfermagem
 ↓
COREN
```

```text
Fisioterapia
 ↓
CREFITO
```

```text
Medicina
 ↓
CRM
```

Por isso, o sistema evita utilizar valores fixos como:

```text
Dr.
Dra.
Médico
CRM
```

em elementos que representam genericamente o profissional da equipe.

---

# 18. Fluxo atual completo

O fluxo principal do protótipo pode ser representado assim:

```text
ABRIR APP
    ↓
SPLASH
    ↓
LOGIN
    ↓
HOME
    ↓
FILA DE OCORRÊNCIAS
    ↓
DETALHES
    ↓
ACEITAR
    ↓
ATENDIMENTO ATIVO
    │
    ├───────────────┐
    │               │
    ↓               ↓
MENSAGENS       FICHA SAE
                    ↓
                CONCLUIR
                    │
    ┌───────────────┘
    ↓
FINALIZAR OCORRÊNCIA
    ↓
HISTÓRICO
    ↓
DETALHES DO ATENDIMENTO
```

---

# 19. Evolução futura

O fluxo das telas deve permanecer aproximadamente igual depois da integração.

A principal mudança acontecerá na fonte dos dados.

Hoje:

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
 ↓
Backend
```

Isso permite integrar o servidor sem reconstruir o fluxo completo da aplicação.
