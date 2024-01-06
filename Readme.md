# Cezar-Zap

Cezar-Zap is a chatbot for WhatsApp designed to manage expenses and revenues, organized by topics. It allows users to create and maintain a detailed record of financial transactions and generates reports in CSV and PDF formats for easy analysis and record-keeping.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Built With](#built-with)
- [Installing](#installing)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

To run Cezar-Zap, you need to have the following installed:

- Docker: A platform for developing, shipping, and running applications in containers.
- Docker-Compose: A tool for defining and running multi-container Docker applications.

## Getting Started

To get a local copy up and running follow these simple steps:

1. Clone the repository:
   ```
   git clone https://github.com/JoaoFVictor/cezar-zap.git
   ```
2. Enter the project folder:
   ```
   cd cezar-zap
   ```
3. Copy the .env.example to .env:
   ```
   cp .env.example .env
   ```
4. Configure the .env file as needed.
5. Start application containers:
   ```
   docker-compose up -d
   ```
6. Install dependency to repository:
   ```
   docker exec cezar-zap npm install
   ```
7. Run database migrations:
   ```
   npm run migration:run
   ```
8. Execute the project:
   ```
   docker exec cezar-zap start
   ```

## Built With

- **PostgreSQL**: Database used for storing and managing data and users.
- **whatsapp-web.js**: Library used for interacting with WhatsApp Web to create the chatbot functionalities.
- **Redis**: Used as a cache system to enhance performance and manage data efficiently.

## Installing

A step by step series of examples that tell you how to get a development environment running.

## Project Structure

The Cezar-Zap project structure is a clean architecture-based layout designed for a WhatsApp chatbot managing expenses and revenues. Key components include:
- **Dockerfile**: Sets up the containerized environment.
- **env.d.ts**: Typescript definitions for environment variables.
- **nodemon.json**: Configuration for automatic server restarts during development.
- **package.json & package-lock.json**: Manage project dependencies.
- **src**: Main source directory containing**:
- **application**: Core business logic and use cases.
- **config**: Configuration files.
- **infrastructure**: External interfaces like databases and caching.
- **entities, use-cases, services, repositories**: Specific functional components handling various aspects of the application logic.

Here is an overview of the project structure:

```
├── Dockerfile
├── docker-compose.yml
├── env.d.ts
├── nodemon.json
├── package.json
├── package-lock.json
├── src
│   ├── application
│   │   ├── entities
│   │   │   ├── Action.ts
│   │   │   ├── enums
│   │   │   │   ├── ActionsEnum.ts
│   │   │   │   ├── CommandsEnum.ts
│   │   │   │   ├── UserExpenseStateEnum.ts
│   │   │   │   ├── UserRevenueStateEnum.ts
│   │   │   │   └── UserTopicStateEnum.ts
│   │   │   ├── Menu.ts
│   │   │   ├── Message.ts
│   │   │   ├── UserExpense.ts
│   │   │   ├── UserRevenue.ts
│   │   │   ├── UserTopic.ts
│   │   │   └── User.ts
│   │   └── use-cases
│   │       ├── actions
│   │       │   ├── DefaultAction.ts
│   │       │   ├── ExecuteAction.ts
│   │       │   ├── factories
│   │       │   │   └── ActionFactory.ts
│   │       │   ├── GetUserRevenueDataInitAction.ts
│   │       │   ├── UserExpenseInitAction.ts
│   │       │   ├── UserRevenueInitAction.ts
│   │       │   └── UserTopicChatInitAction.ts
│   │       ├── auth
│   │       │   ├── AuthenticateUserUseCase.ts
│   │       │   ├── GenerateOtpUseCase.ts
│   │       │   └── RefreshTokenUseCase.ts
│   │       ├── menu
│   │       │   ├── MenuCommandHandlerUseCase.ts
│   │       │   ├── UserMenuInitializeStageUseCase.ts
│   │       │   └── UserMenuMessageDisplayUseCase.ts
│   │       ├── message
│   │       │   └── MessageCommandHandlerUseCase.ts
│   │       ├── user-expense
│   │       │   ├── UserExpenseCommandHandlerUseCase.ts
│   │       │   └── UserExpenseInitializeStageUseCase.ts
│   │       ├── user-revenue
│   │       │   ├── GetUserRevenueDataInitializeStageUseCase.ts
│   │       │   ├── UserRevenueCommandHandlerUseCase.ts
│   │       │   └── UserRevenueInitializeStageUseCase.ts
│   │       └── user-topic
│   │           ├── UserTopicCommandHandlerUseCase.ts
│   │           ├── UserTopicInitializeStageUseCase.ts
│   │           ├── UserTopicMessageDisplayUseCase.ts
│   │           └── UserTopicPromptCreateTopicUseCase.ts
│   ├── config
│   │   └── CacheTimes.ts
│   ├── index.ts
│   └── infrastructure
│       ├── cache
│       │   └── CacheService.ts
│       ├── database
│       │   ├── data-source.ts
│       │   └── migration
│       │       └── ...
│       ├── repositories
│       │   ├── ActionRepository.ts
│       │   ├── MenuRepository.ts
│       │   ├── MessageRepository.ts
│       │   ├── UserExpenseRepository.ts
│       │   ├── UserRepository.ts
│       │   ├── UserRevenueRepository.ts
│       │   └── UserTopicRepository.ts
│       ├── services
│       │   ├── ActionService.ts
│       │   ├── MenuService.ts
│       │   ├── MessageService.ts
│       │   ├── TokenService.ts
│       │   ├── UserExpenseService.ts
│       │   ├── UserRevenueService.ts
│       │   ├── UserService.ts
│       │   └── UserTopicService.ts
│       └── web
│           └── Bot.ts
└── tsconfig.json
```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE.md](LICENSE.md) file for details
