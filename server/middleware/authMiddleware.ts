import type { Request, Response, NextFunction } from "express";
import { dbService } from "../databaseService";

export interface AuthenticatedRequest extends Request {
  user?: any;
  role?: string;
  adminEmail?: string;
}

/**
 * Extracts session token from Authorization header or Cookie or x-session-token
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }
  const customHeader = req.headers["x-session-token"];
  if (typeof customHeader === "string" && customHeader.trim()) {
    return customHeader.trim();
  }
  const adminHeader = req.headers["x-admin-token"];
  if (typeof adminHeader === "string" && adminHeader.trim()) {
    return adminHeader.trim();
  }
  return null;
}

/**
 * Middleware: Requires an active, authenticated Administrator session.
 * Protects against CWE-306 on critical administration endpoints.
 */
export function requireAdminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please sign in to administrator command center.",
    });
  }

  const session = dbService.validateSession(token);
  if (!session || session.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Administrator privileges required.",
    });
  }

  req.user = session.user;
  req.role = session.role;
  req.adminEmail = session.user.email;
  next();
}

/**
 * Middleware: Requires an authenticated user session.
 * Verifies that the caller possesses a valid active session token.
 */
export function requireUserAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please sign in to your account.",
    });
  }

  const session = dbService.validateSession(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired session. Please log in again.",
    });
  }

  req.user = session.user;
  req.role = session.role;
  next();
}

/**
 * Middleware: Optional authentication.
 * Populates req.user if a valid token is present; proceeds as guest otherwise.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (token) {
    const session = dbService.validateSession(token);
    if (session) {
      req.user = session.user;
      req.role = session.role;
    }
  }
  next();
}
