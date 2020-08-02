# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando o seu email;
- O usuário deve receber um email com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar os envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envrio em ambiente de produção;
- O envio de emails deve acontecer em segundo plano (background job);

**RN**

- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;


# Atualização de perfil

**RF**

- O usuário deve poder atualizar seu nome; 

**RN**

- O usuário não pode alterar seu email paa um email já utilizado;
- Para atualizarsua senha, o usuário deve informar a senha antiga;
- Para atualizarsua senha, o usuário precisa confirmar a nova senha;


# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O usuário deve receber uma notificação sepre que houver um novo agendamento;
- O usuário deve poder visualizar as notificaçãoes não lidas;

**RNF**

- Os agendamentos do prestado do dia devem ser armazenadas em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notficaçã deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos o prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache; 

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h e 18h (respectivamente primeiro e último horário);
- O usuário não pode aguardar em um horário já ocupado.
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços com ele mesmo;