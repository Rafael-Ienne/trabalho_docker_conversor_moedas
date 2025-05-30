# 💱 Conversor de Moedas – programação paralela e distribuída com Docker

Este projeto implementa um conversor de moedas utilizando uma arquitetura distribuída baseada em containers Docker. Ele é composto por três partes principais:

- **Frontend**: interface web estática servida via NGINX;
- **Backend**: API Node.js responsável pelas conversões de moeda e salvamento dos dados no banco de dados MongoDB;
- **MongoDB**: banco de dados NoSQL para armazenar histórico e taxas.

A aplicação faz uso de programação paralela no backend para processar múltiplas conversões simultaneamente e é executada de forma distribuída através da rede Docker.

## 📁 Estrutura do projeto

```bash

TrabalhoDocker/
├── frontend/
│ └── index.html
│
├── backend/
│ ├── index.js
│ ├── package.json
│ ├── package-lock.json
│ └── Dockerfile

```

## ✅ Pré-requisitos

Antes de executar este projeto localmente, certifique-se de ter os seguintes requisitos instalados em sua máquina:

- [Docker](https://www.docker.com/) — para orquestrar os containers do backend, frontend e banco de dados MongoDB;
- [Docker Compose](https://docs.docker.com/compose/) — para facilitar a execução dos serviços com um único comando;
- [Git](https://git-scm.com/) — para clonar o repositório.

Além disso, verifique:

- Porta `3000` disponível para o backend;
- Porta `27017` disponível para o MongoDB;
- Porta usada pelo frontend.

Por fim, na função `buscarCotacao` do arquivo `index.js`, colocar a sua API key no lugar da tag `<SUA_API_KEY>` para poder consultar as cotações de moedas em tempo real. A geração da chave é gratuita e pode ser feita por este [link](https://docs.awesomeapi.com.br/instrucoes-api-key).

## 🚀 Como executar o projeto (terminal do Docker)Add commentMore actions

### 1. Criar a rede Docker

```bash
docker network create myNetwork
```
Cria uma rede virtual que permite a comunicação entre os containers.

### 2. Rodar o container do frontend (NGINX)

```bash
docker run --name frontend --network myNetwork -p 8080:80 -v "C:\Users\rafae\TrabalhoDocker\frontend:/usr/share/nginx/html" nginx:alpine
```
Serve os arquivos HTML, CSS e JS da interface web na porta 8080.

### 3. Rodar o container do MongoDB

```bash
docker run -d --name mongo --network myNetwork -p 27017:27017 mongo:latest
```
Inicia o banco de dados MongoDB para armazenar dados de conversão e histórico.

### 4. Criar a imagem do backend

Navegue até a pasta onde está o Dockerfile e execute o seguinte comando:

```bash
docker build -t backend-image .
```
Cria a imagem Docker do backend Node.js com base no Dockerfile.

### 5. Rodar o container do backend

```bash
docker run --name backend --network myNetwork -p 3000:3000 backend-image
```
Executa o servidor backend, que escutará requisições HTTP na porta 3000.

## 💻 Como testar o projeto

Com todos os containers em execução, o frontend da aplicação estará acessível através da porta `8080`.  
Abra seu navegador e acesse:

🔗 [http://localhost:8080](http://localhost:8080)
