# Peanut. Тестове завдання

## Встановлення

### Варіант 1

#### Підготовка

Потрібен встановлений Node: [Install Node](https://nodejs.org/en/download/)

#### Послідовність встановлння

1. Клонируйте репозитрий:

   ```bash
   git clone https://github.com/kondyan2022/peanut
   ```

2. Перейдіть в папку репозиторія:

   ```bash
   cd peanut
   ```

3. Встановіть потрібні пакети:

   ```bash
   npm install
   ```

4. Запустить додаток:

   ```bash
   npm run start
   ```

### Варіант 2

#### Підготовка

Потрібен встановлений Docker: [Install Docker](https://docs.docker.com/get-docker/)

#### Послідовність встановлння

1. Клонируйте репозитрий:

   ```bash
   git clone https://github.com/kondyan2022/peanut
   ```

2. Перейдіть в папку репозиторія:

   ```bash
   cd peanut
   ```

3. Створіть docker-контейнер:

   ```bash
   docker build . -t peanut-test
   ```

4. Запустить docker-контейнер:

   ```bash
   docker run -p 3000:3000 peanut-test
   ```

#### Для обох варінтів локальна адреса додатку:

```bash
   http://localhost:3000
```

#### Документація Swagger:

```bash
   http://localhost:3000/api-docs/
```

## Краткий опис

В API сервісі впроваджена підписка на отримання торгових даних по криптовалютних парах [BTC-USDT, ETH-USDT, ETH-BTC] на біржах [Binance](https://www.binance.com/) та [Kucoin](https://www.kucoin.com). Дані підписки отримуються online через websocket з'єднання з публічних каналів цих бірж та не потребують реєстрації.
Для отримання даних по кожній біржі використовується окремий потік за допомогою модуля `worker_threads`

Торгові данні, розміщються в оперативній пам'яті та оновлюється при кожному сповіщенні з бірж.
На підставі цих даних розраховуються відповіді на запити до API сервісу

Передбачена можливість додавання нових бірж та критовалютних пар.

Файл налаштувань `config.js` в корені проекту:

```javascript
module.exports = {
  scriptPath: "/exchanges",
  coinPairs: [
    ["BTC", "USDT"],
    ["ETH", "USDT"],
    ["ETH", "BTC"],
  ],
  exchanges: [
    { name: "Binance", script: "binance.js" },
    { name: "KuCoin", script: "kucoin.js" },
  ],
};
```

Для кожной біржі створено окремий JavaScript файл у папці `./services/exchanges`. При ініцілізації скрипт отримує список валютих пар.

Щоб додати нову біржу, потрібно створити для неї окремий скипт, що реалізує створення та утримання (ping-pong) socket з'єднання з підпискою та відправку відповідного повідомення батьківському процесу при отриманні торгових даних.

Приклад payload повідомлення:

```javascript
{coin1: "BTC", coin2: "USDT", rate: 65647.8575 }
```
