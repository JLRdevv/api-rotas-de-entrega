FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY apps/route-optimization apps/route-optimization
COPY libs libs

RUN pnpm run build route-optimization

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/route-optimization/main"]
