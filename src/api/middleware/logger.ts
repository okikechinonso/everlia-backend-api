import { NextFunction, Request, Response } from "express";

const logger = (options?: any) => {
  
    return (req: Request, res: Response, next: NextFunction) => {
      const start = process.hrtime.bigint();
      const { method, originalUrl } = req;
      const timestamp = new Date().toISOString();
  
      // When the response finishes, log status and elapsed time
      res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        const { statusCode } = res;
  
        let msg = `[${timestamp}] ${method} ${originalUrl} → ${statusCode} (${durationMs.toFixed(2)} ms)`;
      });
  
      next();
    };
  };

  export default logger