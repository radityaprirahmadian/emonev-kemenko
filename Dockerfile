FROM node:12

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 83

CMD ["npx", "serve", "-l", "83", "build"]