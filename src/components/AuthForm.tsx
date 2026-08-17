"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Loader2, CheckCircle2, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  
  // Login fields
  const [identifier, setIdentifier] = useState(""); // Can be email or phone
  
  // Signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Common fields
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [step, setStep] = useState<"form" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const storedUsers = JSON.parse(localStorage.getItem('mock_users_db_v2') || '[]');

      if (type === "signup") {
        if (!firstName || !lastName || !email || !password || !phone) {
          throw new Error("All fields are required.");
        }
        
        const cleanPhone = phone.trim();
        const cleanEmail = email.trim().toLowerCase();
        
        const phoneRegex = /^((\+92)|(0))3[0-9]{9}$/;
        if (!phoneRegex.test(cleanPhone)) {
          throw new Error("Please enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)");
        }

        // Check if email already exists
        const emailExists = storedUsers.find((u: any) => u.email === cleanEmail);
        if (emailExists) {
          throw new Error("An account with this email address already exists.");
        }

        // Check if phone already exists
        const phoneExists = storedUsers.find((u: any) => u.phone === cleanPhone);
        if (phoneExists) {
          throw new Error("An account with this phone number already exists.");
        }

        const newUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          email: cleanEmail,
          phone: cleanPhone,
          password: password, // Storing in plain text only because this is a mock requirement
          user_metadata: { phone: cleanPhone, first_name: firstName.trim(), last_name: lastName.trim() },
          created_at: new Date().toISOString()
        };

        storedUsers.push(newUser);
        localStorage.setItem('mock_users_db_v2', JSON.stringify(storedUsers));
        
        // Log them in immediately
        login(newUser);
        
      } else {
        if (!identifier || !password) {
          throw new Error("Please enter your email/phone and password.");
        }

        const cleanIdentifier = identifier.trim().toLowerCase();
        const user = storedUsers.find((u: any) => 
          (u.email === cleanIdentifier || u.phone === identifier.trim()) && u.password === password
        );

        if (!user) {
          throw new Error("Invalid credentials. Please check your email/phone and password.");
        }

        // Log them in
        login(user);
      }

      setStep("success");
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-luxury-black border border-gold-500/30 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-bold text-white mb-2">
          Saleem Watch Center
        </h2>
        <p className="text-xs text-gold-500 uppercase tracking-widest font-semibold">
          {step === "form" ? (type === "login" ? "Client Sign In" : "Create Account") : "Authentication Successful"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {type === "login" && (
              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-xs text-gray-400 uppercase tracking-wider">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                    placeholder="Enter your email or phone"
                  />
                </div>
              </div>
            )}

            {type === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-xs text-gray-400 uppercase tracking-wider">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                        placeholder="First"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-xs text-gray-400 uppercase tracking-wider">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                        placeholder="Last"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold">🇵🇰</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                      placeholder="03XX XXXXXXX or +923XX XXXXXXX"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-800 bg-black text-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm placeholder-gray-600 transition-colors"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gold-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || (type === "signup" && (!firstName || !lastName || !email || !phone)) || (type === "login" && !identifier)}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-extrabold uppercase tracking-widest text-black gold-gradient-bg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              type === "login" ? "Sign In" : "Create Account"
            )}
          </button>
          
          <div className="text-center mt-4">
            <Link
              href={type === "login" ? "/signup" : "/login"}
              className="text-xs text-gray-400 hover:text-gold-500 transition-colors uppercase tracking-wider font-semibold inline-block"
            >
              {type === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Link>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-gold-500" />
          <h3 className="text-xl font-serif text-white font-bold text-center">
            {type === "login" ? "Welcome Back" : "Account Created"}
          </h3>
          <p className="text-sm text-gray-400 text-center">
            {type === "login" 
              ? "You have successfully signed in. Redirecting..." 
              : "You have successfully created your account. Redirecting..."}
          </p>
        </div>
      )}
    </div>
  );
}
