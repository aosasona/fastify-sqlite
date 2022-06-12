const options = {
  logger: {
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "hostname",
            },
          }
        : undefined,
  },
};

export default options;
