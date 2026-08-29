# Testes e Checklist do Frontend

## 1. Objetivo

Este documento reúne os testes manuais e verificações técnicas que devem ser executados no frontend do aplicativo SAMU.

A ideia é garantir que:

* os fluxos principais funcionem;
* as telas não estejam quebradas;
* os services estejam integrados corretamente;
* o estado entre telas permaneça consistente;
* erros básicos sejam identificados antes do commit;
* a aplicação esteja preparada para receber o backend.

---

# 2. Teste de inicialização

Ao iniciar o projeto, verificar:

* [ ] O projeto inicia sem erro.
* [ ] O Expo carrega corretamente.
* [ ] A aplicação abre no dispositivo/emulador.
* [ ] A aplicação abre no navegador, quando o Web for utilizado.
* [ ] Não existem erros bloqueantes no terminal.
* [ ] Não existem erros de TypeScript visíveis no editor.

Comando recomendado:

```bash
npx tsc --noEmit
```

Esse comando verifica erros de TypeScript sem gerar arquivos.

---

# 3. Splash

Verificar:

* [ ] A Splash aparece ao iniciar.
* [ ] A identidade visual está correta.
* [ ] Após alguns segundos, o Login aparece.
* [ ] A Splash não fica presa indefinidamente.

Fluxo esperado:

```text
Abrir aplicativo
 ↓
Splash
 ↓
Login
```

---

# 4. Login

Verificar:

* [ ] Campo de e-mail funciona.
* [ ] Campo de senha funciona.
* [ ] E-mail inválido é tratado.
* [ ] Campos vazios são tratados.
* [ ] Botão de entrar funciona.
* [ ] Login válido cria sessão.
* [ ] Após login, o usuário é enviado para a Home.
* [ ] Não existe acesso indevido às telas principais sem sessão.

---

# 5. Logout

Verificar:

* [ ] Botão de logout funciona.
* [ ] A sessão é encerrada.
* [ ] Usuário retorna ao Login.
* [ ] Não permanece em uma tela protegida após logout.

---

# 6. Esqueci minha senha

Verificar:

* [ ] A tela abre pelo Login.
* [ ] Botão voltar funciona.
* [ ] Campo de e-mail funciona.
* [ ] E-mail inválido é tratado.
* [ ] Solicitação de recuperação funciona no fluxo atual.
* [ ] A mensagem apresentada não revela se a conta existe.

---

# 7. Nova senha

Verificar:

* [ ] A tela abre corretamente.
* [ ] Campos aceitam texto.
* [ ] Nova senha é validada.
* [ ] Confirmação é validada, se aplicável.
* [ ] Senhas divergentes são tratadas.
* [ ] Botão principal funciona.
* [ ] Fluxo retorna corretamente ao Login.

---

# 8. Cadastro

## 8.1 Dados pessoais

Verificar:

* [ ] Nome aceita entrada.
* [ ] Nome curto/inválido é tratado.
* [ ] E-mail é validado.
* [ ] CPF aceita entrada.
* [ ] CPF inválido é tratado.
* [ ] Telefone aceita entrada.
* [ ] Telefone inválido é tratado.
* [ ] Botão Continuar só funciona com dados válidos.
* [ ] Botão voltar funciona.

---

## 8.2 Dados profissionais

Verificar:

* [ ] Profissão pode ser informada.
* [ ] Conselho profissional pode ser informado.
* [ ] Registro pode ser informado.
* [ ] UF aceita no máximo duas letras.
* [ ] UF é convertida para maiúsculas.
* [ ] Unidade pode ser informada.
* [ ] Botão Continuar funciona.

---

## 8.3 Áreas de atuação

Verificar:

* [ ] Lista de áreas aparece.
* [ ] Uma área pode ser selecionada.
* [ ] Várias áreas podem ser selecionadas.
* [ ] Uma área pode ser removida da seleção.
* [ ] O usuário não consegue concluir sem área quando isso é obrigatório.
* [ ] Cadastro pode ser finalizado.

---

# 9. Home

Verificar:

* [ ] Dados do profissional aparecem.
* [ ] Unidade aparece.
* [ ] Plantão aparece.
* [ ] Status aparece.
* [ ] Atendimento ativo aparece quando existe.
* [ ] Estado vazio aparece quando não existe atendimento ativo.
* [ ] Fila de ocorrências aparece.
* [ ] Número de ocorrências está correto.
* [ ] Pull-to-refresh funciona.

---

# 10. Fila de prioridade

Verificar:

* [ ] Ocorrências estão ordenadas.
* [ ] Prioridade menor aparece antes.
* [ ] Em caso de mesma prioridade, a ocorrência mais antiga aparece primeiro.
* [ ] Posição da fila está correta.
* [ ] Detalhes podem ser abertos.
* [ ] Não é possível aceitar outro chamado quando já existe um ativo.

---

# 11. Detalhes do chamado

Verificar:

* [ ] ID correto aparece.
* [ ] Paciente correto aparece.
* [ ] Idade aparece.
* [ ] Sexo aparece.
* [ ] Queixa aparece.
* [ ] Telefone aparece.
* [ ] Endereço aparece.
* [ ] Relato aparece.
* [ ] Hospital aparece.
* [ ] Setor aparece.
* [ ] Classificação aparece.
* [ ] Status está correto.

---

# 12. Aceitar ocorrência

Fluxo:

```text
aguardando
 ↓
Aceitar ocorrência
 ↓
em_atendimento
```

Verificar:

* [ ] Botão funciona.
* [ ] Loading aparece, se previsto.
* [ ] Status muda para `em_atendimento`.
* [ ] Atendimento aparece como ativo.
* [ ] Ocorrência deixa a fila.
* [ ] Outro chamado não pode ser aceito simultaneamente.

---

# 13. Atendimento ativo

Verificar:

* [ ] Home exibe o atendimento ativo.
* [ ] Botão Continuar atendimento funciona.
* [ ] A tela correta abre.
* [ ] O tempo de atendimento é atualizado, se exibido.
* [ ] Mensagens ficam disponíveis.
* [ ] Ficha SAE fica disponível.
* [ ] Finalizar ocorrência fica disponível.

---

# 14. Mensagens

Verificar:

* [ ] Tela abre pela ocorrência correta.
* [ ] ID correto aparece.
* [ ] Paciente correto aparece.
* [ ] Mensagens existentes aparecem.
* [ ] Campo de mensagem funciona.
* [ ] Mensagem vazia não é enviada.
* [ ] Botão de envio fica desabilitado sem texto.
* [ ] Loading aparece durante envio.
* [ ] Mensagem aparece após envio.
* [ ] Horário aparece.
* [ ] Nome do profissional não utiliza título médico fixo.
* [ ] Voltar funciona.

---

## 14.1 Persistência temporária das mensagens

Teste:

```text
Abrir Mensagens
 ↓
Enviar mensagem
 ↓
Voltar
 ↓
Abrir Mensagens novamente
```

Verificar:

* [ ] A mensagem enviada continua aparecendo durante a mesma execução do app.

---

## 14.2 Separação por ocorrência

Verificar:

* [ ] Mensagens da ocorrência 1 não aparecem na ocorrência 2.
* [ ] Mensagens da ocorrência 2 não aparecem na ocorrência 1.

---

# 15. Ficha SAE

Verificar:

* [ ] Tela abre apenas durante atendimento ativo.
* [ ] ID correto aparece.
* [ ] Loading funciona.
* [ ] Erro é exibido quando necessário.

---

## 15.1 Seções

Verificar todas as dez:

* [ ] Identificação.
* [ ] Avaliação Primária.
* [ ] Avaliação Secundária.
* [ ] Glasgow.
* [ ] RASS.
* [ ] TRIPS.
* [ ] Trauma e Queimaduras.
* [ ] Morse.
* [ ] Diagnósticos e Intervenções.
* [ ] Finalização.

---

## 15.2 Navegação da Ficha SAE

Verificar:

* [ ] Botão Próxima funciona.
* [ ] Botão Anterior funciona.
* [ ] Botão Anterior está desabilitado na primeira etapa.
* [ ] Seções superiores podem ser selecionadas.
* [ ] Percentual de navegação acompanha a etapa.
* [ ] Scroll funciona.
* [ ] Teclado não impede preenchimento.

---

## 15.3 Conclusão da Ficha SAE

Fluxo:

```text
Etapa Finalização
 ↓
Concluir Ficha
 ↓
Modal
 ↓
Confirmar
 ↓
status = concluida
 ↓
Voltar para ocorrência
```

Verificar:

* [ ] Botão Concluir Ficha funciona.
* [ ] Modal aparece.
* [ ] Botão Revisar fecha modal.
* [ ] Botão Concluir funciona.
* [ ] Loading de conclusão funciona.
* [ ] O usuário volta para a ocorrência.
* [ ] Status da Ficha SAE permanece como `concluida`.

---

# 16. Finalização da ocorrência

## 16.1 Ficha SAE incompleta

Teste:

```text
Atendimento ativo
 ↓
Finalizar ocorrência
```

sem concluir a ficha.

Verificar:

* [ ] Finalização é bloqueada.
* [ ] O sistema informa que a Ficha SAE está pendente.
* [ ] Existe opção para ir até a Ficha SAE.
* [ ] Ocorrência continua ativa.

---

## 16.2 Ficha SAE concluída

Teste:

```text
Concluir Ficha SAE
 ↓
Voltar para ocorrência
 ↓
Finalizar ocorrência
```

Verificar:

* [ ] Sistema reconhece a ficha concluída.
* [ ] Modal de confirmação aparece.
* [ ] Cancelar mantém atendimento ativo.
* [ ] Confirmar finaliza o chamado.
* [ ] Status vira `finalizado`.
* [ ] Ocorrência deixa a Home.

---

# 17. Histórico

Após finalizar uma ocorrência:

```text
Home
 ↓
Histórico
```

Verificar:

* [ ] Ocorrência recém-finalizada aparece.
* [ ] Dados do card estão corretos.
* [ ] Status aparece como Finalizado.
* [ ] Classificação aparece.
* [ ] Paciente aparece.
* [ ] Data aparece.
* [ ] Horário aparece.
* [ ] Endereço aparece.

---

# 18. Filtros do Histórico

## Todos

* [ ] Exibe todos os registros disponíveis.

## Hoje

* [ ] Exibe apenas registros da data atual.

## Semana

* [ ] Exibe apenas registros da semana atual.
* [ ] Semana começa na segunda-feira.

## Mês

* [ ] Exibe apenas registros do mês atual.

---

# 19. Atualização do Histórico

Verificar:

* [ ] Histórico recarrega quando a aba recebe foco.
* [ ] Pull-to-refresh funciona.
* [ ] Erro de carregamento possui opção de tentar novamente.
* [ ] Estado vazio aparece quando não existem resultados.

---

# 20. Detalhes do Histórico

Abrir um card.

Verificar:

* [ ] ID correto aparece.
* [ ] Paciente aparece.
* [ ] Idade aparece.
* [ ] Sexo aparece.
* [ ] Data aparece.
* [ ] Horário aparece.
* [ ] Tipo aparece.
* [ ] Endereço aparece.
* [ ] Hospital aparece.
* [ ] Profissional responsável aparece.
* [ ] Classificação aparece.
* [ ] Status aparece como finalizado.
* [ ] Voltar funciona.

---

## 20.1 Registro recém-finalizado

É importante testar especificamente uma ocorrência finalizada durante a execução atual.

Verificar:

* [ ] Ela aparece na lista.
* [ ] O card abre.
* [ ] A tela de detalhes encontra o atendimento.

Isso garante que lista e detalhes utilizam a mesma fonte.

---

# 21. Perfil

Verificar:

* [ ] Nome aparece.
* [ ] Profissão aparece.
* [ ] Conselho aparece.
* [ ] Registro aparece.
* [ ] Unidade aparece.
* [ ] Áreas de atuação aparecem.
* [ ] Status aparece.
* [ ] Plantão aparece.
* [ ] Editar Perfil funciona.
* [ ] Alterar senha funciona.
* [ ] Logout funciona.

---

# 22. Modelo multiprofissional

Pesquisar visualmente o aplicativo.

Verificar:

* [ ] Não existe `Dr.` fixo para o usuário autenticado.
* [ ] Não existe `Dra.` fixa.
* [ ] Não existe profissão fixa como Médico.
* [ ] Não existe CRM obrigatório para todos.
* [ ] Conselho varia conforme profissão.

---

# 23. Editar Perfil

Verificar:

* [ ] Dados atuais aparecem no formulário.
* [ ] Nome é editável.
* [ ] E-mail é editável.
* [ ] CPF é editável.
* [ ] Telefone é editável.
* [ ] Profissão é editável.
* [ ] Conselho é editável.
* [ ] Registro é editável.
* [ ] UF é editável.
* [ ] Unidade é editável.
* [ ] Áreas de atuação podem ser alteradas.

---

## 23.1 Salvar Perfil

Verificar:

* [ ] Validação funciona.
* [ ] Loading aparece.
* [ ] Atualização passa pelo PerfilContext.
* [ ] Mensagem de sucesso aparece.
* [ ] Voltar ao Perfil funciona.
* [ ] Dados atualizados aparecem no Perfil.

---

# 24. Estados de erro

Revisar telas que carregam dados.

Verificar presença adequada de:

* [ ] loading;
* [ ] erro;
* [ ] vazio;
* [ ] tentar novamente;
* [ ] sucesso.

Uma tela não deve ficar simplesmente vazia quando uma operação falha.

---

# 25. Navegação

Testar:

* [ ] Login → Home.
* [ ] Home → Chamado.
* [ ] Chamado → Mensagens.
* [ ] Mensagens → Chamado.
* [ ] Chamado → Ficha SAE.
* [ ] Ficha SAE → Chamado.
* [ ] Chamado → Home.
* [ ] Home → Histórico.
* [ ] Histórico → Detalhes.
* [ ] Detalhes → Histórico.
* [ ] Perfil → Editar Perfil.
* [ ] Editar Perfil → Perfil.

---

# 26. Botão voltar

Verificar em todas as telas secundárias:

* [ ] funciona;
* [ ] não leva para uma tela incorreta;
* [ ] não cria loops de navegação.

---

# 27. Verificação de TypeScript

Executar:

```bash
npx tsc --noEmit
```

Resultado esperado:

```text
nenhum erro
```

Caso apareçam erros, corrigir antes do commit sempre que possível.

---

# 28. Varredura do código antigo

No VS Code, utilize a busca global.

Atalho:

```text
Ctrl + Shift + F
```

Pesquisar:

```text
cargo
```

```text
especialidades
```

```text
ESPECIALIDADES
```

```text
Dr.
```

```text
Dra.
```

Cada ocorrência deve ser analisada.

---

# 29. Buscar mocks diretos em telas

Pesquisar:

```text
criarChamadoMock
```

```text
criarConversaMock
```

```text
historicoMock
```

As telas não devem acessar esses mocks diretamente.

O esperado é que apareçam principalmente dentro das camadas de service/mock.

---

# 30. Buscar chamadas HTTP diretas

Pesquisar:

```text
fetch(
```

e:

```text
axios
```

Quando a integração começar, chamadas HTTP devem ficar preferencialmente na camada de API/service, e não espalhadas nas telas.

---

# 31. Buscar logs

Pesquisar:

```text
console.log
```

Revisar cada ocorrência.

Evitar logs com:

* dados do paciente;
* Ficha SAE completa;
* CPF;
* informações clínicas;
* dados de autenticação.

---

# 32. Verificação de secrets

Antes de commit/push:

* [ ] `.env` não está rastreado.
* [ ] nenhuma senha está no código;
* [ ] nenhum token está no código;
* [ ] nenhuma chave privada está no código;
* [ ] nenhuma credencial está no README ou docs.

---

# 33. Verificação do Git

Antes do commit:

```bash
git status
```

Verificar cuidadosamente os arquivos alterados.

Também pode usar:

```bash
git diff
```

para revisar as mudanças.

---

# 34. Teste do fluxo completo

Executar pelo menos uma vez:

```text
Abrir aplicativo
 ↓
Login
 ↓
Home
 ↓
Selecionar ocorrência
 ↓
Aceitar
 ↓
Mensagens
 ↓
Enviar mensagem
 ↓
Voltar
 ↓
Ficha SAE
 ↓
Concluir
 ↓
Voltar
 ↓
Finalizar ocorrência
 ↓
Home
 ↓
Histórico
 ↓
Abrir ocorrência finalizada
 ↓
Detalhes
 ↓
Perfil
 ↓
Editar Perfil
 ↓
Salvar
```

Se esse fluxo funcionar, grande parte da integração atual do frontend está operacional.

---

# 35. Checklist antes de commit

* [ ] Aplicação inicia.
* [ ] TypeScript sem erros bloqueantes.
* [ ] Fluxo principal testado.
* [ ] Rotas funcionando.
* [ ] Sem imports quebrados.
* [ ] Sem mocks diretos novos em telas.
* [ ] Sem logs sensíveis.
* [ ] Sem credenciais.
* [ ] Documentação atualizada.
* [ ] `git status` revisado.

---

# 36. Checklist antes da integração com backend

* [ ] Frontend revisado.
* [ ] Services centralizados.
* [ ] Tipos revisados.
* [ ] Modelo multiprofissional consolidado.
* [ ] Mocks diretos removidos das telas.
* [ ] Ficha SAE revisada.
* [ ] Fluxo de finalização funcionando.
* [ ] Histórico funcionando.
* [ ] Documentação do backend recebida.
* [ ] Swagger/OpenAPI disponível, se houver.
* [ ] Estratégia de autenticação conhecida.
* [ ] Endpoints conhecidos.
* [ ] Payloads conhecidos.
* [ ] Códigos de erro conhecidos.

---

# 37. Observação final

Este checklist deve ser atualizado conforme novas funcionalidades forem adicionadas.

Ele não substitui testes automatizados futuros, mas ajuda a garantir consistência durante a fase atual de desenvolvimento do frontend.
