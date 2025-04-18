"use client";
import React, {Fragment, useEffect, useRef} from 'react';

import { Header } from "@/components/headers/header"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search/search-main"


export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(14))] flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 grow bg-gradient-to-br from-[#020618] to-[#140033]" >
            <div className="flex flex-1 flex-col gap-4 p-4 justify-center items-center">
              <div className="mb-4">
              <p className="text-center">Track all your Solana wallets in one place—explore others’ mains and alts for forensics or copy trading.</p>
              </div>
              <div>
                <SearchForm />
              </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

