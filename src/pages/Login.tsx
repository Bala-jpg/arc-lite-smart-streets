import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { securityLogger, sanitizeInput } from "@/lib/security";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Rate limiting check
    if (!sanitizeInput.checkRateLimit('email_auth', 5, 300000)) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait 5 minutes before trying again.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput.email(email);
    const sanitizedPassword = sanitizeInput.password(password);

    // Log authentication attempt
    securityLogger.logEvent({
      type: 'AUTH_ATTEMPT',
      email: sanitizedEmail,
      provider: 'email'
    });

    try {
      // Additional password validation for sign up
      if (isSignUp) {
        const passwordValidation = sanitizeInput.validatePasswordStrength(sanitizedPassword);
        if (!passwordValidation.isValid) {
          toast({
            title: "Password Requirements",
            description: passwordValidation.errors[0],
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      const { error } = isSignUp 
        ? await signUpWithEmail(sanitizedEmail, sanitizedPassword)
        : await signInWithEmail(sanitizedEmail, sanitizedPassword);

      if (error) {
        // Log authentication failure
        securityLogger.logEvent({
          type: 'AUTH_FAILURE',
          email: sanitizedEmail,
          provider: 'email',
          errorMessage: error.message
        });

        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Log successful authentication
        securityLogger.logEvent({
          type: 'AUTH_SUCCESS',
          email: sanitizedEmail,
          provider: 'email'
        });

        if (isSignUp) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link"
          });
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      // Log authentication failure
      securityLogger.logEvent({
        type: 'AUTH_FAILURE',
        email: sanitizedEmail,
        provider: 'email',
        errorMessage: error.message
      });

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      
      // Log authentication attempt
      securityLogger.logEvent({
        type: 'AUTH_ATTEMPT',
        provider: 'google'
      });

      const { error } = await signInWithGoogle();
      if (error) {
        // Log authentication failure
        securityLogger.logEvent({
          type: 'AUTH_FAILURE',
          provider: 'google',
          errorMessage: error.message
        });

        toast({
          title: "Google Sign-In Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Log successful authentication
        securityLogger.logEvent({
          type: 'AUTH_SUCCESS',
          provider: 'google'
        });
      }
    } catch (error: any) {
      // Log authentication failure
      securityLogger.logEvent({
        type: 'AUTH_FAILURE',
        provider: 'google',
        errorMessage: error.message
      });

      toast({
        title: "Google Sign-In Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ARC-LITE
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Smarter Streets. Brighter Future.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Sign up to access your smart lighting dashboard"
                : "Sign in to access your smart lighting dashboard"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arc-lite.com"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-background/50 border-border/50 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium"
                size="lg"
              >
                {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                className="w-full"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign {isSignUp ? "up" : "in"} with Google
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp 
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Automatic Reactive Control Lighting & Intelligent Tracking Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;