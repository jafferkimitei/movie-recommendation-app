"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backgrounds = [
  "/login1.jpg",
  "/login2.jpg",
  "/login3.webp"
];

export default function SignInPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Generate floating particles
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(particleArray);
  }, []);

  useEffect(() => {
    const cycleBackgrounds = () => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length);
    };
    const interval = setInterval(cycleBackgrounds, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session?.user) {
          router.push('/');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-white text-2xl font-light">Loading...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgrounds[currentBg]})`
          }}
        />
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-purple-900/30 to-slate-900/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/60" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Jafflix
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-4"
            />
            <p className="text-gray-300 text-lg font-light">
              Unlimited movies and more.
            </p>
          </motion.div>

          {/* Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="backdrop-blur-xl bg-black/40 rounded-2xl p-8 border border-gray-800/50 shadow-2xl"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="mb-6"
            >
              <Button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="cursor-pointer w-full py-6 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-transparent hover:border-gray-300"
              >
                <GoogleIcon isHovered={isHovered} />
                Sign in with Google
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-gray-400 text-sm leading-relaxed">
                By signing in, you agree to our{" "}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer underline">
                  Privacy Policy
                </span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <path d="M21.8 10.5H12v3h5.6c-.3 1.5-1.6 3.5-5.6 3.5-3.4 0-6.1-2.7-6.1-6s2.7-6 6.1-6c1.6 0 2.8.6 3.5 1.4l2.5-2.4C17.4 2.2 15 1 12 1 6.4 1 1.8 5.6 1.8 11.2S6.4 21.4 12 21.4c5.3 0 9.8-3.7 9.8-9.4 0-.6-.1-1.1-.2-1.5z" />
    </motion.svg>
  );
}