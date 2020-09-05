import { runQuirrel } from ".";

const { PORT = 3000, REDIS_URL } = process.env;

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

async function main() {
  const quirrel = await runQuirrel({
    port: +PORT,
    redis: !!REDIS_URL ? REDIS_URL : undefined,
  });

  async function teardown(signal: string) {
    await quirrel.close();
    console.log("Received %s - terminating server app ...", signal);
    process.exit(2);
  }

  process.on("SIGTERM", teardown);
  process.on("SIGINT", teardown);
}

main();