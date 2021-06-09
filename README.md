<h1 align="center">
    <img alt="GoBarber-logo" src="https://github.com/ecrozatti/GoBarber_Backend/blob/master/.github/logo.svg" width="250px" />
</h1>

<p align="center">
  <a href="#page_with_curl-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#books-requisitos">Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-começando">Começando</a>
</p>

<h1 align="center">
    <img alt="GoBarber" src="https://github.com/ecrozatti/GoBarber_Backend/blob/master/.github/gobarber.png" />
</h1>

## :page_with_curl: Sobre
![GitHub language count](https://img.shields.io/github/languages/count/ecrozatti/GoFinances_NodeJS)
![GitHub top language](https://img.shields.io/github/languages/top/ecrozatti/GoFinances_NodeJS)
![GitHub repo size](https://img.shields.io/github/repo-size/ecrozatti/GoFinances_NodeJS)
![GitHub](https://img.shields.io/github/license/ecrozatti/GoFinances_NodeJS)
![GitHub last commit](https://img.shields.io/github/last-commit/ecrozatti/GoFinances_NodeJS)

Este repositório contém a API REST da aplicação GoBarber. Projeto backend usando Node.js com TypeScript, banco de dados PostegreSQL com TypeORM e upload de imagens com Multer.

GoBarber é uma aplicação para gerenciamento da agenda de barbearias. O projeto pode ser acessado tanto por clientes, como por prestadores de serviços.

Clientes podem escolher os horários disponíveis e os barbeiros podem conseguem gerenciar suas agendas.

## :computer: Tecnologias
Esse projeto foi desenvolvido no Bootcamp GoStack da Rocketseat com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [TypeORM](https://typeorm.io/#/)
- [JWT-token](https://jwt.io/)
- [uuid v4](https://github.com/thenativeweb/uuidv4/)
- [PostgreSQL](https://www.postgresql.org/)
- [Date-fns](https://date-fns.org/)
- [Jest](https://jestjs.io/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## :books: Requisitos
- Ter [**Git**](https://git-scm.com/) para clonar o projeto.
- Ter [**Node.js**](https://nodejs.org/en/) instalado.
- Ter [**Docker**](https://www.docker.com/) rodando um container PostgreSQL.

## :rocket: Começando
``` bash
  # Clonar o projeto:
  $ git clone https://github.com/ecrozatti/GoBarber_Backend.git

  # Entrar no diretório:
  $ cd GoBarber_Backend
  
  # Instalar as dependências:
  $ yarn install

  # Rodar as migrations:
  $ yarn typeorm migration:run

  # Rodar a aplicação:
  $ yarn dev:server
```

Made with 💚 by [Eric Crozatti Ferreira](https://www.linkedin.com/in/eric-crozatti-1447688a/)
