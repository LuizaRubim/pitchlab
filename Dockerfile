# -------- BUILDER --------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -------- RUNTIME --------
# --- Etapa 2: Runner (Caddy) ---
FROM caddy:2-alpine

# Copia o Caddyfile configurado
COPY Caddyfile /etc/caddy/Caddyfile

# Copia APENAS os arquivos estáticos gerados no build anterior para a pasta do Caddy
COPY --from=builder /app/out /usr/share/caddy

# Expõe a porta 80
EXPOSE 80
EXPOSE 443