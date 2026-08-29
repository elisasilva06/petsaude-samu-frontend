# Telas e Funcionalidades

## 1. Objetivo deste documento

Este documento descreve as principais telas do frontend, suas responsabilidades, os dados exibidos, as ações disponíveis e as pendências atuais.

A ideia é facilitar:

* manutenção;
* desenvolvimento em equipe;
* integração futura com o backend;
* entendimento do fluxo por novos integrantes.

---

# 2. Tela de Login

## Objetivo

Permitir que o profissional entre no aplicativo.

## Elementos principais

* campo de e-mail;
* campo de senha;
* botão de entrar;
* acesso à recuperação de senha;
* acesso ao cadastro.

## Fluxo

```text
Login
 ↓
validar dados
 ↓
AuthContext
 ↓
sessão criada
 ↓
Home
```

## Pendências futuras

* autenticação real;
* token;
* refresh token;
* regras de expiração;
* erros retornados pelo backend.

---

# 3. Splash

## Objetivo

Apresentar brevemente a identidade visual do aplicativo antes do Login.

A Splash está integrada ao fluxo inicial.

## Comportamento

```text
Abrir aplicativo
 ↓
Splash
 ↓
Login
```

---

# 4. Esqueci minha senha

## Objetivo

Permitir o início do fluxo de recuperação de senha.

## Elementos

* campo de e-mail;
* botão de envio;
* botão de voltar.

## Observação

A resposta deve permanecer genérica para evitar confirmar se determinado e-mail está ou não cadastrado.

## Pendência

A integração real depende do mecanismo definido pelo backend.

---

# 5. Nova senha

## Objetivo

Permitir a redefinição da senha durante o fluxo de recuperação.

## Responsabilidades

* receber nova senha;
* validar regras básicas;
* confirmar senha;
* enviar redefinição pelo service.

## Pendências futuras

* regras reais de senha;
* credencial de recuperação;
* expiração da credencial;
* integração com backend.

---

# 6. Cadastro — Dados pessoais

## Objetivo

Coletar informações básicas do profissional.

## Campos

```text
Nome
E-mail
CPF
Telefone
```

## Validações atuais

Existem validações básicas no frontend.

Essas validações servem para experiência do usuário e não substituem validações futuras no backend.

---

# 7. Cadastro — Dados profissionais

## Objetivo

Coletar as informações profissionais do usuário.

## Campos

```text
Profissão
Conselho profissional
Registro
UF
Unidade
```

## Modelo multiprofissional

O sistema não pressupõe que o profissional seja médico.

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

# 8. Cadastro — Áreas de atuação

## Objetivo

Permitir que o profissional selecione uma ou mais áreas relacionadas à sua atuação.

## Áreas atualmente disponíveis

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

## Observação

A lista atual é temporária e poderá posteriormente vir do backend.

---

# 9. Cadastro — Sucesso

## Objetivo

Informar que o processo de cadastro foi concluído.

A tela é essencialmente de apresentação e encerramento do fluxo.

---

# 10. Home

## Objetivo

Funcionar como painel principal de operação do profissional.

## Informações exibidas

* identificação do profissional;
* unidade;
* plantão;
* status;
* atendimento ativo;
* fila de ocorrências.

---

## 10.1 Atendimento ativo

Quando existe uma ocorrência em andamento, ela aparece em destaque.

Ações disponíveis:

```text
Continuar atendimento
```

O profissional pode retornar diretamente aos detalhes do chamado ativo.

---

## 10.2 Sem atendimento ativo

Quando não existe atendimento em andamento:

```text
Nenhum atendimento ativo
 ↓
Fila disponível
```

O profissional pode selecionar uma ocorrência para consultar seus detalhes e aceitar o atendimento.

---

## 10.3 Fila de prioridade

Cada ocorrência apresenta informações resumidas, como:

* paciente;
* bairro;
* classificação;
* queixa;
* posição na fila.

A fila é ordenada atualmente por:

1. prioridade;
2. horário de recebimento.

A regra definitiva deve vir do backend.

---

## 10.4 Atualização

A Home recarrega os dados quando recebe foco.

Também possui atualização manual por gesto de pull-to-refresh.

---

# 11. Detalhes do Chamado

## Rota

```text
/chamado/[id]
```

## Objetivo

Apresentar as informações completas de uma ocorrência.

## Informações possíveis

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
Latitude
Longitude
Classificação
Prioridade
Status
```

---

## 11.1 Chamado aguardando

Quando a ocorrência possui:

```text
status = aguardando
```

o principal botão disponível é:

```text
Aceitar ocorrência
```

Ao aceitar:

```text
aguardando
 ↓
em_atendimento
```

---

## 11.2 Chamado em atendimento

Quando o chamado está ativo, ficam disponíveis:

```text
Mensagens
Ficha SAE
Finalizar ocorrência
```

Também é exibida indicação visual de que o atendimento está em andamento.

---

# 12. Mensagens

## Rota

```text
/mensagens/[id]
```

## Objetivo

Permitir comunicação relacionada a uma ocorrência específica.

## Características

* conversa separada por ocorrência;
* paciente exibido no cabeçalho;
* mensagens recebidas e enviadas;
* horário;
* nome do autor;
* campo de texto;
* botão de envio.

## Arquitetura

```text
MensagensScreen
 ↓
mensagensService
 ↓
mensagensMockService
```

## Estado atual

O mock utiliza armazenamento em memória separado por ID da ocorrência.

Exemplo:

```text
Ocorrência 1
 └── mensagens da ocorrência 1

Ocorrência 2
 └── mensagens da ocorrência 2
```

## Pendências futuras

* persistência real;
* atualização em tempo real, se prevista;
* confirmação de leitura, se prevista;
* política de mensagens do backend.

---

# 13. Ficha SAE

## Rota

```text
/ficha-sae/[id]
```

## Objetivo

Registrar informações relacionadas ao atendimento da ocorrência.

## Restrição atual

A ficha só pode ser preenchida enquanto a ocorrência estiver:

```text
em_atendimento
```

---

## 13.1 Seções

A ficha possui dez seções.

### 01 — Identificação

Informações gerais e identificação do atendimento.

### 02 — Avaliação Primária

Informações da avaliação inicial.

### 03 — Avaliação Secundária

Informações complementares da avaliação.

### 04 — Escala de Glasgow

Área destinada ao registro da escala correspondente.

### 05 — Escala RASS

Área destinada ao registro da escala correspondente.

### 06 — Escala TRIPS

Área destinada ao registro da escala correspondente.

### 07 — Trauma e Queimaduras

Informações relacionadas a trauma e queimaduras.

### 08 — Escala de Morse

Área destinada ao registro da escala correspondente.

### 09 — Diagnósticos e Intervenções

Registro de diagnósticos e intervenções.

### 10 — Finalização

Informações finais do atendimento.

---

## 13.2 Navegação

Existem dois mecanismos de navegação:

* botões Anterior e Próxima;
* seleção direta da seção na navegação superior.

O percentual atual representa a posição de navegação e não necessariamente o percentual real de campos preenchidos.

---

## 13.3 Status da ficha

```text
nao_iniciada
em_preenchimento
concluida
```

Ao abrir a ficha:

```text
marcarEmPreenchimento()
```

Ao concluir:

```text
Concluir Ficha
 ↓
Modal
 ↓
Confirmar
 ↓
marcarComoConcluida()
```

---

## 13.4 Pendências da Ficha SAE

Ainda precisam ser implementados:

* persistência de rascunho;
* recuperação do rascunho;
* validação formal das dez seções;
* definição oficial dos campos obrigatórios;
* backend;
* registro histórico completo;
* PDF.

O PDF foi adiado para uma etapa futura.

---

# 14. Finalização da ocorrência

## Objetivo

Encerrar oficialmente o atendimento ativo.

## Regra atual

A ocorrência só pode ser finalizada se a Ficha SAE estiver concluída.

Fluxo:

```text
Finalizar ocorrência
 ↓
buscar status da Ficha SAE
```

### Caso incompleta

```text
bloquear
 ↓
Ir para Ficha SAE
```

### Caso concluída

```text
Modal de confirmação
 ↓
finalizarChamado()
 ↓
status = finalizado
```

---

# 15. Histórico

## Rota

```text
/(tabs)/historico
```

## Objetivo

Listar os atendimentos finalizados.

## Informações do card

* paciente;
* idade;
* sexo;
* data;
* horário;
* tipo de ocorrência;
* endereço;
* classificação;
* status finalizado.

## Filtros

```text
Todos
Hoje
Semana
Mês
```

## Arquitetura

```text
HistoricoScreen
 ↓
historicoService
```

A tela não acessa o mock diretamente.

---

# 16. Detalhes do Histórico

## Rota

```text
/detalhesHistorico/[id]
```

## Objetivo

Exibir informações completas de um atendimento já finalizado.

## Informações exibidas

```text
Status
Classificação
Paciente
Idade
Sexo
Tipo
Data
Horário
Local
Hospital
Profissional responsável
```

## Ficha SAE

Existe uma seção reservada para o registro clínico.

Atualmente ela apresenta uma mensagem informativa.

Futuramente poderá permitir:

```text
Visualizar Ficha SAE
Visualizar PDF
```

---

# 17. Perfil

## Rota

```text
/(tabs)/perfil
```

## Objetivo

Exibir os dados do profissional autenticado.

## Informações principais

```text
Nome
Profissão
Conselho
Registro
Unidade
Áreas de atuação
Status
Plantão
```

## Ações

```text
Editar perfil
Alterar senha
Logout
```

---

# 18. Editar Perfil

## Rota

```text
/editar-perfil
```

## Objetivo

Permitir atualização das informações pessoais e profissionais.

## Campos editáveis

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

## Fluxo

```text
Editar
 ↓
Validar
 ↓
PerfilContext.atualizarPerfil()
 ↓
Confirmação
```

## Observação

A tela não deve acessar diretamente mock ou API.

---

# 19. Alterar senha

## Rota

```text
/alterar-senha
```

## Objetivo

Permitir que um usuário autenticado altere sua senha.

## Pendências futuras

A regra real dependerá do backend:

* senha atual;
* política de nova senha;
* autenticação;
* tratamento de erro.

---

# 20. Estados visuais adotados

Sempre que possível, as telas devem prever:

```text
Loading
Erro
Vazio
Sucesso
Conteúdo
```

Exemplo:

```text
buscar dados
 ↓
loading
 ↓
sucesso → mostrar conteúdo

ou

erro → mostrar opção de tentar novamente
```

---

# 21. Regras gerais da interface

As telas devem:

* usar as cores centralizadas em `theme.ts`;
* evitar valores de negócio fixos quando podem vir do backend;
* não presumir profissão médica;
* apresentar erro de forma compreensível;
* impedir múltiplos envios durante loading;
* utilizar services para operações de dados.

---

# 22. Estado atual das telas

| Tela                  | Estado                     |
| --------------------- | -------------------------- |
| Splash                | Funcional                  |
| Login                 | Funcional                  |
| Esqueci senha         | Funcional no mock          |
| Nova senha            | Funcional no mock          |
| Cadastro              | Funcional                  |
| Home                  | Base operacional funcional |
| Chamado               | Base operacional funcional |
| Mensagens             | Base operacional funcional |
| Ficha SAE             | Fluxo funcional            |
| Finalização           | Fluxo funcional            |
| Histórico             | Integrado                  |
| Detalhes do Histórico | Integrado                  |
| Perfil                | Atualizado                 |
| Editar Perfil         | Atualizado                 |
| Alterar senha         | Base preparada             |

---

# 23. Próximas revisões

Antes da integração com o backend, ainda é necessário:

```text
Revisar código
 ↓
Encontrar restos do modelo antigo
 ↓
Remover mocks diretos
 ↓
Consolidar tipos
 ↓
Validar navegação
 ↓
Executar testes
```

Termos importantes a procurar no projeto:

```text
cargo
especialidades
ESPECIALIDADES
Dr.
Dra.
historicoMock
criarConversaMock
criarChamadoMock
```

A presença desses termos não significa automaticamente que existe um erro, mas cada ocorrência deve ser revisada.
