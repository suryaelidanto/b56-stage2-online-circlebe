import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger-output.json";
import { aqmplibConnect } from "./libs/rabbitmq/rabbitmq";
import { redisClient, redisClientConnect } from "./libs/redis-client";
import { routerV1 } from "./routes/v1";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    })
  );
}

aqmplibConnect()
  .then(() => {
    redisClientConnect()
      .then(async () => {
        const limiter = rateLimit({
          windowMs: 30 * 1000,
          limit: 10,
          standardHeaders: true,
          legacyHeaders: false,
          store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          }),
        });

        app.use(limiter);
        app.use("/api/v1", routerV1);

        app.listen(port, () => {
          console.log(`Listening on port ${port}`);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });
