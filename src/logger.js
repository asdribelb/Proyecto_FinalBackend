import winston from "winston";

const devLogger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

const prodLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "INFO.log" }),
    new winston.transports.File({ filename: "ERRORS.log", level: "error" }),
  ],
});

console.log(process.env.ENV);

const logger = process.env.ENV === "production" ? prodLogger : devLogger;

export default logger;