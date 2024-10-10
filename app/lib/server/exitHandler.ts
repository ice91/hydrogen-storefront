// app/lib/server/exitHandler.ts

export function onExit(callback: () => void) {
    process.on("SIGINT", () => {
      callback();
      process.exit();
    });
    process.on("SIGTERM", () => {
      callback();
      process.exit();
    });
  }
  