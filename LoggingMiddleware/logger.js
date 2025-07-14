// Logger middleware for the URL shortener application

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs in memory
  }

  // Log levels
  static LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  };

  // Add a log entry
  addLog(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output based on level
    switch (level) {
      case Logger.LEVELS.ERROR:
        console.error(`[${logEntry.timestamp}] ${message}`, data);
        break;
      case Logger.LEVELS.WARN:
        console.warn(`[${logEntry.timestamp}] ${message}`, data);
        break;
      case Logger.LEVELS.INFO:
        console.info(`[${logEntry.timestamp}] ${message}`, data);
        break;
      case Logger.LEVELS.DEBUG:
        console.debug(`[${logEntry.timestamp}] ${message}`, data);
        break;
      default:
        console.log(`[${logEntry.timestamp}] ${message}`, data);
    }

    return logEntry;
  }

  // Log methods for different levels
  error(message, data = null) {
    return this.addLog(Logger.LEVELS.ERROR, message, data);
  }

  warn(message, data = null) {
    return this.addLog(Logger.LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    return this.addLog(Logger.LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    return this.addLog(Logger.LEVELS.DEBUG, message, data);
  }

  // Get all logs
  getLogs() {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs within a time range
  getLogsByTimeRange(startTime, endTime) {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs as JSON
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  // Send logs to server (for production)
  async sendLogsToServer() {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: this.logs,
          sessionId: this.getSessionId(),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        this.info('Logs sent to server successfully');
        return true;
      } else {
        this.error('Failed to send logs to server', { status: response.status });
        return false;
      }
    } catch (error) {
      this.error('Error sending logs to server', { error: error.message });
      return false;
    }
  }

  // Generate session ID
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return this.sessionId;
  }

  // Performance monitoring
  time(label) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
        return duration;
      }
    };
  }

  // Error boundary helper
  logError(error, errorInfo = null) {
    this.error('Application Error', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
}

// Create a singleton instance
const logger = new Logger();

// Export the logger instance and class
export default logger;
export { Logger };

// Middleware for React components
export const withLogging = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      logger.info(`Component mounted: ${WrappedComponent.name}`);
    }

    componentWillUnmount() {
      logger.info(`Component unmounted: ${WrappedComponent.name}`);
    }

    componentDidCatch(error, errorInfo) {
      logger.logError(error, errorInfo);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
  