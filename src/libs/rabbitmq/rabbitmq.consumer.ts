import { CIRCLE_QUEUE } from "./rabbitmq.constant";
import amqplib from "amqplib/callback_api";
import dotenv from "dotenv";
import threadController from "../../controllers/thread.controller";
dotenv.config();

const queue = CIRCLE_QUEUE.THREAD;

amqplib.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, ch) => {
    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        await threadController.dequeue(JSON.parse(msg.content.toString()));
        ch.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });
});
