import { createApp } from "./app";

const startServer = async () => {
  try {
    const app = await createApp();

    await app.listen({
      port: app.config.PORT,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
