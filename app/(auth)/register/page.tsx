
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  FaUser, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner 
} from 'react-icons/fa';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data:any) => {
    setLoading(true);
    setResponseMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      const responseData = await res.json();

      if (res.ok) {
        setResponseMessage({ 
          type: 'success', 
          text: 'Registration successful! Redirecting to login...' 
        });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setResponseMessage({ 
          type: 'error', 
          text: responseData.message || "Registration failed" 
        });
      }
    } catch (error) {
      setResponseMessage({ 
        type: 'error', 
        text: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen w-full bg-white p-4">
      <div className="m-auto w-full">
        <div className="w-full max-w-md m-auto">
          <h2 className="text-2xl font-bold text-[#1A365D] text-left mb-6">
            Create your free account
          </h2>
          <div className="text-left mt-2">
            <p className="text-sm text-gray-600">
              Already registered? 
              <Link 
                href="/login" 
                className="text-[#4CAF50] font-semibold ml-1 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-md mt-5 shadow-2xl rounded-md m-auto">
          <div className="bg-white p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label 
                    htmlFor="firstName" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className='relative'>
                    <input 
                      id="firstName"
                      type="text" 
                      placeholder="Enter first name" 
                      className={`w-full px-0 py-2 border-b ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                      {...register("firstName")}
                    />
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaUser className="h-5 w-5" />
                    </span>
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label 
                    htmlFor="lastName" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <div className='relative'>
                    <input 
                      id="lastName"
                      type="text" 
                      placeholder="Enter last name" 
                      className={`w-full px-0 py-2 border-b ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                      {...register("lastName")}
                    />
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaUser className="h-5 w-5" />
                    </span>
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

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
                    className={`w-full px-0 py-2 border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                    {...register("email")}
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="h-5 w-5" />
                  </span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                    className={`w-full px-0 py-2 border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-green-500 transition-colors duration-300`}
                    {...register("password")}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {responseMessage.text && (
                <div className={`text-sm text-center p-2 rounded ${responseMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {responseMessage.text}
                </div>
              )}

             <div className=" flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full md:w-fit md:px-5 bg-[#4CAF50] text-white py-1 hover:bg-green-600 transition duration-300 mt-4 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : "Continue"}
                </button>
              </div>
            </form>
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
    </div>
  );
}