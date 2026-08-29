# Integração com Backend

## 1. Objetivo deste documento

Este documento registra como o frontend deverá se integrar ao backend futuramente.

O objetivo é:

* reduzir retrabalho;
* evitar contratos inventados no frontend;
* facilitar alinhamento entre as equipes;
* identificar quais dados e endpoints ainda precisam ser definidos;
* manter as telas desacopladas da implementação da API.

---

# 2. Princípio de integração

Atualmente, o frontend utiliza mocks.

Fluxo atual:

```text
Tela
 ↓
Context ou Service
 ↓
Mock
```

Fluxo futuro:

```text
Tela
 ↓
Context ou Service
 ↓
API Service
 ↓
Backend
```

A ideia é trocar a fonte dos dados sem reconstruir as telas.

---

# 3. O que o frontend não deve inventar

Antes de receber o contrato real do backend, não devem ser definidos arbitrariamente:

* endpoints;
* base URL definitiva;
* tokens;
* refresh tokens;
* payloads;
* nomes de campos;
* códigos de erro;
* WebSocket;
* eventos em tempo real;
* permissões;
* formato dos documentos;
* regras clínicas;
* regras definitivas da fila.

Exemplo do que deve ser evitado:

```ts
const endpoint = '/api/chamados';
```

se esse endpoint ainda não foi definido oficialmente.

---

# 4. O que precisamos receber do backend

Antes da integração, a equipe do frontend precisa ter acesso a uma documentação contendo:

* URL base da API;
* endpoints;
* métodos HTTP;
* formatos de request;
* formatos de response;
* autenticação;
* autorização;
* códigos de erro;
* regras de negócio;
* paginação;
* filtros;
* upload e download, quando aplicável;
* regras para mensagens em tempo real, se existirem.

Preferencialmente:

* Swagger;
* OpenAPI;
* documentação técnica equivalente.

---

# 5. Autenticação

Atualmente o frontend possui:

* Login;
* Sessão global;
* Logout;
* Esqueci minha senha;
* Nova senha;
* Alterar senha.

O backend deverá definir o contrato real dessas operações.

---

## 5.1 Login

Precisamos saber:

* endpoint;
* método HTTP;
* campos obrigatórios;
* formato da resposta;
* existência ou não de token;
* tipo de token;
* duração da sessão;
* dados do usuário retornados.

Exemplo conceitual:

```text
Login
 ↓
AuthService
 ↓
Backend
 ↓
Sessão
```

Não assumir antecipadamente:

```text
accessToken
refreshToken
JWT
Bearer
```

até que o backend defina o mecanismo real.

---

## 5.2 Logout

Precisamos confirmar se o logout será:

* apenas local;
* invalidado no servidor;
* associado a refresh token;
* associado a sessão persistida.

---

## 5.3 Recuperação de senha

O backend deverá informar:

* como a recuperação é solicitada;
* como a identidade do usuário é validada;
* se haverá e-mail;
* token temporário;
* código;
* validade;
* redefinição.

O frontend já está preparado para trabalhar com uma credencial de recuperação genérica.

---

# 6. Perfil profissional

O frontend trabalha atualmente com:

```text
nome
email
cpf
telefone
profissao
conselho
registro
uf
unidade
areasAtuacao
status
plantao
```

O backend deverá informar:

* endpoint de consulta;
* endpoint de atualização;
* quais campos são editáveis;
* quais campos são somente leitura;
* origem das áreas de atuação;
* regras do status profissional;
* regras do plantão.

---

# 7. Modelo multiprofissional

O backend deve permitir diferentes categorias profissionais.

Exemplos:

```text
Enfermagem / COREN
Fisioterapia / CREFITO
Medicina / CRM
```

Por isso, evitar um modelo rígido baseado apenas em:

```text
CRM
médico
especialidade médica
```

O ideal é trabalhar com:

```text
profissao
conselho
registro
```

---

# 8. Cadastro

O backend deverá receber os dados coletados durante o cadastro.

## Dados pessoais

* nome;
* e-mail;
* CPF;
* telefone.

## Dados profissionais

* profissão;
* conselho;
* registro;
* UF;
* unidade.

## Áreas de atuação

* lista de áreas selecionadas.

Precisamos confirmar:

* quais campos são obrigatórios;
* regras de unicidade;
* validação de CPF;
* validação de registro profissional;
* se áreas de atuação vêm do backend;
* como erros de cadastro são retornados.

---

# 9. Chamados

O frontend possui atualmente operações para:

```text
buscar painel
buscar chamado
aceitar chamado
finalizar chamado
listar finalizados
```

O backend deverá ser a fonte definitiva do estado das ocorrências.

---

## 9.1 Painel

Precisamos saber como obter:

* atendimento ativo;
* fila de ocorrências;
* prioridade;
* classificação;
* horário de recebimento;
* situação atual.

O frontend não deve decidir sozinho a prioridade clínica.

---

## 9.2 Aceitar chamado

Fluxo esperado:

```text
Profissional
 ↓
Aceitar ocorrência
 ↓
Backend valida
 ↓
Ocorrência atribuída
 ↓
status atualizado
```

O backend deverá verificar:

* se o chamado ainda está disponível;
* se outro profissional já aceitou;
* se o profissional pode aceitar;
* se existe atendimento ativo incompatível;
* mudança de status.

---

## 9.3 Concorrência

Esse ponto é importante.

No mock atual existe apenas uma aplicação local.

No sistema real, vários profissionais poderão consultar a fila ao mesmo tempo.

Exemplo:

```text
Profissional A
       \
        → Ocorrência #10
       /
Profissional B
```

Se os dois tentarem aceitar ao mesmo tempo, o backend deve garantir que apenas a operação válida seja aceita.

Essa regra não pode depender apenas do frontend.

---

# 10. Prioridade da fila

A regra temporária atual é:

```text
prioridade
 ↓
horário de chegada
```

Isso é apenas uma forma de simular a fila.

A classificação definitiva precisa vir da regra oficial do sistema.

O frontend deverá apenas apresentar a ordem recebida ou os dados necessários para ordenação, conforme contrato definido.

---

# 11. Detalhes da ocorrência

O frontend atualmente trabalha com informações como:

* paciente;
* idade;
* sexo;
* queixa;
* telefone;
* bairro;
* endereço;
* relato;
* hospital;
* setor;
* latitude;
* longitude;
* classificação;
* prioridade;
* status.

Precisamos confirmar quais desses campos realmente existirão na API.

---

# 12. Mensagens

Atualmente:

```text
MensagensScreen
 ↓
mensagensService
 ↓
mensagensMockService
```

Futuramente:

```text
MensagensScreen
 ↓
mensagensService
 ↓
mensagensApiService
 ↓
Backend
```

---

## 12.1 Operações necessárias

Precisamos saber como:

* listar mensagens de uma ocorrência;
* enviar mensagem;
* identificar autor;
* receber horário;
* ordenar mensagens;
* recuperar histórico.

---

## 12.2 Tempo real

Não devemos assumir que haverá WebSocket.

O backend precisa definir se utilizará:

* WebSocket;
* Socket.IO;
* Server-Sent Events;
* polling;
* outra estratégia;
* nenhuma atualização em tempo real.

Depois disso, o frontend implementa o mecanismo correspondente.

---

# 13. Ficha SAE

A Ficha SAE é uma das integrações mais importantes.

O frontend atualmente controla:

```text
nao_iniciada
em_preenchimento
concluida
```

Isso é temporário.

O backend deverá ser a fonte definitiva do estado da ficha.

---

## 13.1 Operações esperadas

Provavelmente serão necessárias operações equivalentes a:

```text
buscar ficha
salvar rascunho
atualizar ficha
concluir ficha
consultar status
```

Os endpoints reais só devem ser implementados depois da documentação do backend.

---

## 13.2 Persistência de rascunho

Atualmente, o conteúdo da ficha não possui persistência definitiva.

No sistema real, o usuário não deve perder todo o preenchimento ao sair da tela.

Fluxo desejado:

```text
Preencher Ficha SAE
 ↓
Salvar rascunho
 ↓
Backend
 ↓
Sair da tela
 ↓
Abrir novamente
 ↓
Recuperar rascunho
```

---

# 14. Validação da Ficha SAE

O frontend poderá validar campos para melhorar a experiência do usuário.

Exemplo:

```text
campo obrigatório vazio
 ↓
mostrar aviso
```

Mas a validação definitiva precisa ocorrer também no backend.

Fluxo correto:

```text
Frontend valida
 ↓
Backend valida novamente
 ↓
Persistência
```

Isso evita que alguém consiga enviar uma requisição diretamente para a API ignorando as regras da interface.

---

# 15. Regras clínicas

O frontend não deve definir sozinho:

* pontuação de escalas;
* limites;
* classificação clínica;
* critérios de gravidade;
* campos obrigatórios clínicos;
* interpretação de resultados.

Essas regras devem vir de especificação oficial do projeto e/ou backend.

Isso é especialmente importante para:

* Glasgow;
* RASS;
* TRIPS;
* Morse;
* trauma;
* queimaduras;
* diagnósticos;
* intervenções.

---

# 16. Finalização da ocorrência

A regra atual exige Ficha SAE concluída.

No sistema real, a verificação não pode existir apenas no frontend.

Fluxo recomendado:

```text
Frontend solicita finalização
 ↓
Backend verifica
 ├── ocorrência está ativa?
 ├── profissional pode finalizar?
 ├── Ficha SAE existe?
 └── Ficha SAE está concluída?
 ↓
Finalização aceita
```

Caso alguma condição não seja atendida, o backend deve negar a operação.

---

# 17. Histórico

Atualmente, o frontend combina registros mockados e ocorrências finalizadas durante a execução.

No backend, o Histórico deverá ser persistente.

Operações esperadas:

* listar atendimentos;
* buscar atendimento por ID;
* filtrar por período;
* ordenar;
* paginar.

---

# 18. Paginação

O histórico pode crescer bastante.

Por isso, provavelmente não será adequado retornar todos os atendimentos de uma vez.

Precisamos confirmar se o backend utilizará algo como:

```text
page
limit
offset
cursor
```

O frontend será adaptado ao modelo definido.

---

# 19. Filtros do Histórico

O frontend possui:

* Todos;
* Hoje;
* Semana;
* Mês.

Atualmente esses filtros são locais.

Com backend, podemos ter:

```text
Frontend
 ↓
filtro selecionado
 ↓
historicoService
 ↓
API
 ↓
dados filtrados
```

Isso será especialmente importante com paginação.

---

# 20. Detalhes do Histórico

O backend deverá retornar os dados consolidados do atendimento.

Não é ideal que o frontend precise reconstruir permanentemente o histórico a partir do estado atual do chamado.

O registro histórico deve preservar o que ocorreu no momento do atendimento.

---

# 21. Profissional responsável

Hoje existe um valor temporário em alguns registros:

```text
Profissional responsável
```

No backend, o atendimento finalizado deve possuir o profissional real associado.

Exemplo conceitual:

```text
atendimento
 ↓
profissionalResponsavel
 ↓
nome
profissao
conselho
registro
```

O formato exato depende da API.

---

# 22. PDF da Ficha SAE

A geração do PDF foi adiada.

Quando for implementada, a preferência é:

```text
Ficha SAE concluída
 ↓
Backend valida
 ↓
Backend gera documento
 ↓
Documento vinculado à ocorrência
 ↓
Histórico
 ↓
Visualizar documento
```

---

# 23. Por que o PDF deve preferencialmente ser gerado no backend

Motivos:

* integridade do documento;
* controle de acesso;
* auditoria;
* versionamento;
* rastreabilidade;
* consistência;
* proteção de dados.

O frontend pode solicitar ou visualizar o arquivo, mas não deve ser a única fonte do documento definitivo.

---

# 24. Segurança do documento

Evitar arquivos públicos como:

```text
https://servidor/ficha-paciente.pdf
```

sem autenticação.

O acesso deve respeitar:

* usuário autenticado;
* autorização;
* vínculo com atendimento;
* regras institucionais.

---

# 25. Uploads e anexos

O modelo atual de chamado possui referência a fotos.

Caso a aplicação permita anexos, o backend precisa definir:

* upload;
* tamanho máximo;
* tipos permitidos;
* armazenamento;
* acesso;
* exclusão;
* autorização.

Não devemos inventar esse fluxo antes do contrato existir.

---

# 26. Tratamento de erros

A API deverá possuir um padrão consistente de erros.

Precisamos saber:

* status HTTP;
* código interno;
* mensagem;
* detalhes;
* erros de validação.

Exemplo conceitual:

```text
Requisição
 ↓
Backend
 ↓
Erro
 ↓
Service traduz erro
 ↓
Tela apresenta mensagem compreensível
```

As telas não devem depender de mensagens técnicas brutas do servidor.

---

# 27. API Services

Quando a API existir, cada domínio poderá ganhar um service específico.

Exemplo:

```text
features/chamados/services/
├── chamados.service.ts
├── chamados.mock.service.ts
├── chamados.api.service.ts
└── index.ts
```

Durante desenvolvimento:

```ts
export const chamadosService =
  chamadosMockService;
```

Depois:

```ts
export const chamadosService =
  chamadosApiService;
```

As telas continuam importando:

```ts
chamadosService
```

---

# 28. Mappers

Se o formato da API for diferente dos tipos usados pelas telas, devem ser utilizados mappers.

Exemplo:

```text
Resposta da API
 ↓
Mapper
 ↓
Modelo do frontend
```

Isso evita espalhar detalhes da API pelas telas.

---

# 29. Exemplo conceitual

Backend retorna:

```ts
{
  patient_name: 'Maria',
  received_at: '...',
}
```

Frontend utiliza:

```ts
{
  paciente: 'Maria',
  recebidoEm: '...',
}
```

Um mapper pode realizar essa transformação.

Assim, a tela continua utilizando o padrão do frontend.

---

# 30. Variáveis de ambiente

A URL da API e outras configurações de ambiente não devem ficar fixas no código.

Exemplo conceitual:

```text
desenvolvimento
homologação
produção
```

Cada ambiente poderá possuir configurações diferentes.

A estratégia definitiva será definida durante a integração.

---

# 31. Dados sensíveis

O aplicativo trabalha com informações pessoais e potencialmente clínicas.

Devemos evitar:

* logs desnecessários;
* exposição em console;
* URLs públicas;
* armazenamento inseguro;
* dados sensíveis em commits.

Também não devemos adicionar secrets ao repositório.

---

# 32. Logs

Evitar:

```ts
console.log(fichaCompleta);
```

principalmente quando contiver dados de atendimento.

Logs técnicos devem ser mínimos e apropriados ao ambiente.

---

# 33. Checklist para receber o backend

Antes de iniciar a integração, solicitar:

* [ ] URL da API;
* [ ] Swagger/OpenAPI;
* [ ] autenticação;
* [ ] login;
* [ ] logout;
* [ ] recuperação de senha;
* [ ] perfil;
* [ ] cadastro;
* [ ] chamados;
* [ ] fila;
* [ ] aceite;
* [ ] finalização;
* [ ] mensagens;
* [ ] Ficha SAE;
* [ ] histórico;
* [ ] paginação;
* [ ] filtros;
* [ ] códigos de erro;
* [ ] permissões;
* [ ] uploads;
* [ ] mecanismo de realtime, se existir.

---

# 34. Ordem recomendada de integração

Uma ordem possível é:

```text
1. Configuração da API
 ↓
2. Autenticação
 ↓
3. Perfil
 ↓
4. Chamados / Home
 ↓
5. Aceite
 ↓
6. Mensagens
 ↓
7. Ficha SAE
 ↓
8. Finalização
 ↓
9. Histórico
```

Dessa forma, os fluxos mais básicos são validados antes dos mais complexos.

---

# 35. Objetivo final

A integração deve transformar:

```text
Frontend
 ↓
Mock
```

em:

```text
Frontend
 ↓
Service
 ↓
API
 ↓
Backend
```

sem alterar desnecessariamente a estrutura das telas já construídas.
