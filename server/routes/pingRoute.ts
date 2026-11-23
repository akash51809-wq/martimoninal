import { Router, type Request, type Response } from "express";

export const pingRouter = Router();

/**
 * High-performance, lightweight keep-alive ping handler.
 * Designed for automated uptime monitors and cron services:
 * (e.g. Cron-job.org, UptimeRobot, BetterUptime, EasyCron, GitHub Actions).
 * 
 * Prevents free-tier hosting platforms (such as Render) from entering idle sleep mode.
 * Supports both GET and HEAD methods.
 */
pingRouter.all(["/", "/ping"], (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "alive",
    message: "pong",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: "Vivah Kar Lo Matrimonial Platform",
    environment: process.env.NODE_ENV || "production",
  });
});
