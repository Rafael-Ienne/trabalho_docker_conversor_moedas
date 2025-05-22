# 💱 Conversor de Moedas – Programação Paralela e Distribuída com Docker

Este projeto implementa um conversor de moedas utilizando uma arquitetura distribuída baseada em containers Docker. Ele é composto por três partes principais:

- **Frontend**: Interface web estática servida via NGINX.
- **Backend**: API Node.js responsável pelas conversões de moeda e acesso ao banco de dados.
- **MongoDB**: Banco de dados NoSQL para armazenar histórico e taxas.

A aplicação faz uso de programação paralela no backend para processar múltiplas conversões simultaneamente e é executada de forma distribuída através da rede Docker.

---

## 📁 Estrutura do Projeto

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

---

## 🚀 Como Executar o Projeto

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

Navegue até a pasta backend no terminal:

```bash
cd backend
docker build -t backend-image .
```
Cria a imagem Docker do backend Node.js com base no Dockerfile.

### 5. Rodar o container do backend

```bash
docker run --name backend --network myNetwork -p 3000:3000 backend-image
```
Executa o servidor backend, que escutará requisições HTTP na porta 3000.
