import { Search } from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar"
import { isValidSolanaAddress } from "@/lib/solana";
import { toast } from "sonner";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cleanSearchTerm = searchTerm.trim()
    if (e.key === "Enter" && cleanSearchTerm) {
      e.preventDefault()
      if(isValidSolanaAddress(cleanSearchTerm)){
        router.push(`/search/${searchTerm}`);
      }else{
        toast.error('Please enter a valid Solana address')
      }
    }
  };

  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for address"
          className="h-8 pl-7"
          onKeyDown={handleKeyDown}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
