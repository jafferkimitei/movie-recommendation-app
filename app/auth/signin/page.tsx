"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const backgrounds = [
  "/images/login-bg-1.jpg",
  "/images/login-bg-2.jpg",
  "/images/login-bg-3.jpg"
];

export default function SignInPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentBg, setCurrentBg] = useState(backgrounds[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let index = 0;
    const cycleBackgrounds = () => {
      index = (index + 1) % backgrounds.length;
      setCurrentBg(backgrounds[index]);
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-black bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), url(${currentBg})`
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-8 py-12 bg-black/80 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-800 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-red-600 mb-2">Jafflix</h1>
          <p className="text-gray-300">Unlimited movies, TV shows, and more.</p>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="mb-6"
        >
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-6 bg-white text-black hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
          >
            <GoogleIcon isHovered={isHovered} />
            Sign in with Google
          </Button>
        </motion.div>

        <div className="text-center text-gray-400 text-sm">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </motion.div>
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
      transition={{ duration: 0.5 }}
    >
      <path d="M21.8 10.5H12v3h5.6c-.3 1.5-1.6 3.5-5.6 3.5-3.4 0-6.1-2.7-6.1-6s2.7-6 6.1-6c1.6 0 2.8.6 3.5 1.4l2.5-2.4C17.4 2.2 15 1 12 1 6.4 1 1.8 5.6 1.8 11.2S6.4 21.4 12 21.4c5.3 0 9.8-3.7 9.8-9.4 0-.6-.1-1.1-.2-1.5z" />
    </motion.svg>
  );
}