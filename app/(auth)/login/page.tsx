"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';


const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string()
    .min(1, "Password is required")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        setResponseMessage({
          type: 'error',
          text: result.error
        });
      } else {
        setResponseMessage({
          type: 'success',
          text: "Login successful! Redirecting..."
        });
        setTimeout(() => router.push("/myaccount/users"), 1500);
      }
    } catch (error) {
      setResponseMessage({
        type: 'error',
        text: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen w-full bg-white p-4">
      <div className="m-auto w-full">
        <div className="w-full max-w-md m-auto">
          <h2 className="text-2xl font-bold text-[#1A365D] text-left mb-6">
            Login to your account
          </h2>
          <div className="text-left mt-2">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <Link 
                href="/register" 
                className="text-[#4CAF50] font-semibold ml-1 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full max-w-md mt-5 shadow-2xl rounded-md m-auto">
          <div className="bg-white p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className={`w-full px-0 py-2 text-black border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                    {...register('email')}
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="h-4 w-4" />
                  </span>
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className={`w-full px-0 py-2 text-black border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                    {...register('password')}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {responseMessage && (
                <div className={`text-sm text-center p-2 rounded ${responseMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {responseMessage.text}
                </div>
              )}

              <div className=" flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full  md:w-fit md:px-5 bg-[#4CAF50] text-white py-1 hover:bg-green-600 transition duration-300 mt-4 flex items-center justify-center disabled:bg-green-300"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center flex justify-between text-xs md:p-5 text-gray-500 mt-4">
        <p>By signing up, you agree to our 
          <Link href="/terms" className="text-[#4CAF50] ml-1">
            Terms
          </Link> and 
          <Link href="/privacy" className="text-[#4CAF50] ml-1">
            Privacy Policy
          </Link>
        </p>
        <p className="">© 2019 Tinylabs. All rights reserved.</p>
      </div>
    </div>
  );
}