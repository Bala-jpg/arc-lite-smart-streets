/**
 * Security utilities for authentication logging and input validation
 */

interface SecurityEvent {
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'AUTH_ATTEMPT' | 'SUSPICIOUS_ACTIVITY';
  userId?: string;
  email?: string;
  provider?: string;
  errorMessage?: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  logEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    this.events.push(securityEvent);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Security Event]', securityEvent);
    }
    
    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const securityLogger = SecurityLogger.getInstance();

/**
 * Input sanitization utilities
 */
export const sanitizeInput = {
  email: (email: string): string => {
    return email.trim().toLowerCase();
  },
  
  password: (password: string): string => {
    return password.trim();
  },
  
  /**
   * Basic password strength validation
   */
  validatePasswordStrength: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Rate limiting check (simple client-side implementation)
   */
  checkRateLimit: (action: string, maxAttempts: number = 5, windowMs: number = 300000): boolean => {
    const key = `rateLimit_${action}`;
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];
    
    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true; // Allow the action
  }
};
