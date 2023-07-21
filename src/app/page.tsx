'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toast'
import Dashboard from '../../components/dashboard';


export default function Home() {

  return (
    <main className="min-h-screen">
      <div className="min-h-screen flex justify-center items-center h-screen flex-col">


        <div className="">
          <Dashboard />
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}
