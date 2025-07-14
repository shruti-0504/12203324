# Logging Middleware

This middleware is a reusable, production-grade logging utility tailored for the React-based URL Shortener evaluation project.

## 🔧 Features
- Supports levels: `info`, `error`, `warn`, `debug`
- Logs include timestamp, userAgent, URL
- Stores up to 1000 logs in memory
- Filters by time or level
- Can send logs to server
- Performance timing helper
- React HOC for auto-logging mount/unmount events

## 📦 Integration Example

```js
import logger from "../middleware/logger";

logger.info("URL_SHORTENED", {
  inputUrl: "https://google.com",
  shortcode: "go123"
});
