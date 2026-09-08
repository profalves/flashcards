/**
 * Serviço centralizado de logging para aplicação
 * Fornece uma interface consistente para logs com timestamps e níveis
 */

export enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
  WARN = "WARN",
  SUCCESS = "SUCCESS",
  DEBUG = "DEBUG",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log de informação
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log de erro
   */
  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log de sucesso
   */
  success(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.SUCCESS, message, context);
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Método privado para log com emoji e formatação
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): void {
    const emoji = this.getEmoji(level);
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";

    const logMessage = `${emoji} [${timestamp}] ${message}${contextStr}`;

    // Usar console.error para erros e warnings, console.log para o resto
    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * Retorna emoji correspondente ao nível de log
   */
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

// Exportar instância singleton
export const logger = new Logger();
