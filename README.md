# Desafio 4 - API Escalável de Otimização de Rotas de Entrega

Uma API escalável construída com NestJS para otimização de rotas de entrega, utilizando arquitetura de microsserviços com comunicação via RabbitMQ.

## Arquitetura

A aplicação é composta por 4 microsserviços:

- **Gateway**: API Gateway principal com Swagger
- **Auth**: Serviço de autenticação e usuários
- **Points**: Gerenciamento de pontos de entrega
- **Route Optimization** : Otimização de rotas

### Infraestrutura

- **MongoDB**: Banco de dados principal
- **RabbitMQ**: Message broker para comunicação entre serviços

## Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (opcional, para desenvolvimento)
- pnpm (opcional, para desenvolvimento)

### Executando com Docker Compose (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Squad-E-PB-JUN25/Desafio4_PB_JUN25
   cd Desafio4_PB_JUN25
   ```

2. **Configure as variáveis de ambiente:**
   
   Crie os arquivos de ambiente necessários:
   
   - `apps/gateway/.env`
   - `apps/auth/.env`
   - `apps/points/.env`
   - `apps/route-optimization/.env`
   - `config/mongo.env`
   - `config/rmq.env`

3. **Execute a aplicação:**
   ```bash
   docker compose up -d
   ```

4. **Verifique se os serviços estão rodando:**
   ```bash
   docker compose ps
   ```

### 📱 Acessando a Aplicação

- **API Principal:** [http://localhost](http://localhost)
- **Documentação Swagger:** [http://localhost/api/docs](http://localhost/api/docs)
- **Health Check:** [http://localhost/](http://localhost/)
- **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672)

## Documentação da API

A API possui documentação completa disponível através do Swagger UI:

**[http://localhost/api/docs](http://localhost/api/docs)**

### Principais Endpoints

#### Autenticação (`/auth`)
- `POST /auth/signup` - Criar conta
- `POST /auth/login` - Fazer login
- `POST /auth/logout` - Fazer logout
- `GET /auth/whoami` - Informações do usuário logado

#### Pontos (`/pontos`)
- `GET /pontos` - Listar pontos do usuário
- `GET /pontos/:id` - Obter ponto específico
- `POST /pontos` - Adicionar pontos
- `PATCH /pontos/:id` - Atualizar pontos
- `DELETE /pontos/:id` - Remover pontos

#### Rotas (`/rotas`)
- `GET /rotas/:id` - Calcular rota otimizada
- `GET /rotas/:pointsId/:pointId` - Rota com ponto inicial específico
- `GET /rotas/historico` - Histórico de rotas (com filtros por data)
- `DELETE /rotas/:routeId` - Remover rota do histórico

#### Health Check (`/`)
- `GET /` - Status de todos os microsserviços

## Kubernetes

A aplicação também pode ser executada em Kubernetes. Os manifests estão disponíveis na pasta `k8s/`:

```bash
# Aplicar todos os manifests
kubectl apply -f k8s/

# Ou aplicar por serviço
kubectl apply -f k8s/mongo/
kubectl apply -f k8s/rabbitmq/
kubectl apply -f k8s/auth/
kubectl apply -f k8s/gateway/
```

### Estrutura Kubernetes

```
k8s/
├── mongo/
│   ├── mongo-deployment.yaml
│   └── mongo-service.yaml
├── rabbitmq/
│   ├── rabbitmq-deployment.yaml
│   └── rabbitmq-service.yaml
├── auth/
│   ├── auth-deployment.yaml
│   └── auth-service.yaml
├── gateway/
│   ├── gateway-deployment.yaml
│   └── gateway-service.yaml
└── ingress/
    └── ingress-gateway.yaml
```

## Desenvolvimento

### Executando Localmente

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Executar serviços de infraestrutura:**
   ```bash
   docker compose up mongo rabbitmq -d
   ```

3. **Executar cada microsserviço:**
   ```bash
   # Gateway
   pnpm run start:dev gateway

   # Auth
   pnpm run start:dev auth

   # Points
   pnpm run start:dev points

   # Route Optimization
   pnpm run start:dev route-optimization
   ```

## Testes

```bash
pnpm run test
```

## Autenticação

A aplicação utiliza JWT para autenticação. O token pode ser enviado via:

- **Cookie** (recomendado): `token`
- **Header Authorization**: `Bearer <token>`

### Fluxo de Autenticação

1. **Registro/Login** → Recebe JWT token
2. **Token é salvo** em cookie automaticamente
3. **Requisições protegidas** verificam o token
4. **Logout** limpa o cookie

## Monitoramento

### Health Checks

- **Global**: `GET /` - Status de todos os serviços
- **Individual**: Cada serviço possui endpoint `/health`

### RabbitMQ Management

Interface web disponível em [http://localhost:15672](http://localhost:15672) para monitoramento das filas e mensagens.


<div align="center"><b>Desenvolvido por Squad E</b></div>
