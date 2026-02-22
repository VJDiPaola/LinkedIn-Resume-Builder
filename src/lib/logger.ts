type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, data?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    })
  );
}

export const log = {
  info: (message: string, data?: Record<string, unknown>) => write("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => write("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => write("error", message, data),
};
