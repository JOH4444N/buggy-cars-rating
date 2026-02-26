FROM cypress/included:13.6.0

WORKDIR /e2e

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "cypress", "run"]