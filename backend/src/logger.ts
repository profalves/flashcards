enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
  WARN = "WARN",
  SUCCESS = "SUCCESS",
  DEBUG = "DEBUG",
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  success(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.SUCCESS, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): void {
    const emoji = this.getEmoji(level);
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";

    const logMessage = `${emoji} [${timestamp}] ${message}${contextStr}`;

    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  private getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      [LogLevel.INFO]: "ℹ️",
      [LogLevel.ERROR]: "❌",
      [LogLevel.WARN]: "⚠️",
      [LogLevel.SUCCESS]: "✅",
      [LogLevel.DEBUG]: "🐛",
    };
    return emojis[level];
  }
}

export const logger = new Logger();
