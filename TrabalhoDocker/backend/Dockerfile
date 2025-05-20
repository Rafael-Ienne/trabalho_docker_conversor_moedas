# Dockerfile usado para criar uma imagem Docker que empacota e executa uma aplicação Node.js

#Imagem
FROM node:14

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json (caso exista) do seu projeto para dentro do container
COPY package*.json ./

# Executa npm install dentro do container para instalar as dependências listadas no package.json
RUN npm install

# Copia todo o restante dos arquivos do seu projeto local para dentro do container (incluindo os arquivos .js, pastas, etc.).
# O segundo ponto (.) é o destino, que já é o diretório de trabalho definido acima.
COPY . .

# Exposição da porta 3000 para que outros containers tenham acesso a ela
EXPOSE 3000

# Executa o arquivo principal definido no package.json
CMD ["npm", "start"]
