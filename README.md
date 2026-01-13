# Scientometrics

Проект портала scientometrics для управления публикациями и импортом данных из РИНЦ.

## Технологии

- **Runtime**: NodeJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Web Framework**: Fastify
- **Queue**: BullMQ (Redis)
- **Parser**: XML/JSON парсеры для данных РИНЦ

## Структура проекта

```
scientometrics/
├── prisma/                    # Prisma schema и миграции
├── src/
│   ├── application/           # Use cases и события
│   │   ├── use-cases/
│   │   ├── parsers/
│   │   └── events/
│   ├── domain/                # Domain логика и репозитории
│   │   ├── domains/
│   │   └── repositories/
│   ├── infrastructure/        # Реализация репозиториев, воркеры
│   │   ├── repositories/
│   │   ├── workers/
│   │   └── database/
│   ├── interfaces/            # DTOs, routes, controllers
│   │   └── dto/
│   └── generated/            # Сгенерированный Prisma Client
└── uploads/                  # Загруженные файлы для импорта
```

## Установка

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

## Миграции базы данных

```bash
# Генерация клиента
npm run generate 

# Применение миграций
npm run migrate 

# Синхронизация схемы (для разработки)
npx prisma db push
```

## Запуск

```bash
# Запуск сервера
npm run dev
```

## Архитектура

### Domain Layer
Содержит бизнес-логику и сущности:
- `Publication` - сущность публикации
- `Article` - сущность статьи из РИНЦ
- `ImportProcess` - процесс импорта

### Application Layer
Use cases для бизнес-операций:
- `ImportRincZip` - импорт ZIP-архива РИНЦ
- `ProcessImportFiles` - обработка файлов импорта
- `RetrieveProcessImport` - получение статуса импорта

### Infrastructure Layer
Технические реализации:
- Репозитории для работы с БД
- Воркеры для обработки очередей
- Плагины Fastify

### Domain-Driven Design
Проект следует принципам DDD с четким разделением слоев.

## Определение типа публикации

Тип публикации определяется автоматически на основе:
1. `typeCode` - код типа материала
2. `genre` - жанр публикации
3. `title` - лингвистический анализ заголовка

**Типы публикаций:**
- `SCIENTIFIC_ARTICLE` - научная статья
- `LITERATURE_REVIEW` - литературный обзор
- `BOOK_REVIEW` - рецензия
- `BIOGRAPHICAL_MATERIAL` - биографический материал
- `TRANSLATION` - перевод
- `EDITORIAL_MATERIAL` - редакционный материал
- `RETRACTION_NOTICE` - уведомление о ретракции
- `NOTE` - заметка
- `NOTICE` - уведомление
- `REQUIRES_MANUAL_CLASSIFICATION` - требует ручной классификации

## API

### Импорт данных

```typescript
// Запуск импорта ZIP-архива
POST /api/v1/rinc/import
В теле запроса form-data с файлом ZIP-архива

// Получение статуса импорта
GET /api/v1/rinc/import/:uuid
```

### Публикации

```typescript
// Обновление публикации
PUT /api/v1/publications/:uuid
{
  "title": "New title",
  "type": "SCIENTIFIC_ARTICLE"
}
```

## Конфигурация

Основные настройки в `.env`:
- `DATABASE_URL` - подключение к PostgreSQL
- `REDIS_HOST` - Хост к Redis
- `REDIS_PORT` - Порт Redis
- `PORT` - Порт сервера

## Лицензия

MIT
