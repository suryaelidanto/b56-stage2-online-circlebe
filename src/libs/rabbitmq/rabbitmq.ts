import amqplib from "amqplib/callback_api";

export let amqplibChannel: amqplib.Channel;

export async function aqmplibConnect() {
  amqplib.connect("amqp://localhost", (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, ch) => {
      if (err) throw err;
      amqplibChannel = ch;
    });
  });
}
