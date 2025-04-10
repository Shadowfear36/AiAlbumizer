FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force && npm rebuild lightningcss

COPY . .

# Ensure scripts like `next` are in PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Start the dev server
CMD ["npm", "run", "dev"]
