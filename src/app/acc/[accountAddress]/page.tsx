"use client";
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import type { Metadata } from 'next';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Share, Pencil, List, Network, Copy } from "lucide-react"
import { useRouter, useParams } from 'next/navigation';

import IdentityIcon from "@/components/identicon"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/headers/sidebar-header"
import { ClusterBalanceCard } from "@/components/widgets/cluster-balance-card"
import { ClusterPnlCard } from "@/components/widgets/cluster-pnl-card"
import { ClusterAssociatedAccounts } from "@/components/widgets/cluster-accounts-card"
import { ClusterAchievements } from "@/components/widgets/cluster-achievements-card"
import { ClusterTopHoldings } from "@/components/widgets/cluster-top-holdings-card"
import { ClusterRecentTransactions } from "@/components/widgets/cluster-recent-txs-card"
import { ClusterAddToWatchlist } from '@/components/widgets/cluster-add-to-watchlist';

import useTitle from '@/hooks/use-title';
import Link from 'next/link';
import { ICluster } from '@/types/cluster';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import { RefreshPageButton } from '@/components/refresh-page-button';
import { truncateHeading } from '@/lib/formatting';

// TODO: check if this works: { params }: { params: { clusterId: string } }
export default function Page() {
  const router = useRouter();
  const { accountAddress } = useParams<{ accountAddress: string }>();
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<ICluster | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/address/${accountAddress}`, {method: 'GET'})
      .then((res) => {
        if(!res.ok) throw new Error('Bad response from server')
        return res.json()
      })
      .then(({ data: payload }) => {
        if(typeof payload === 'object' || typeof payload?.id === 'string' ){
          setData(payload)
        }else{
          throw new Error('Invalid response from server')
        }
      })
      .catch((error) => {
        toast.error('Error occurred', {
            duration: Infinity,
            description: error.message || "",
            action: <RefreshPageButton />
        })
      })
      .finally(() => setIsLoading(false));
  }, [accountAddress]);

  // on load
  useEffect(() => {
    // useTitle(cluster.name)
  }, [])

  return (
  <div className="[--header-height:calc(--spacing(14))]">
    <SidebarProvider className="flex flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset>
          { data === null ? 
          <Loader />
          :
          <div className="flex flex-1 flex-col gap-4 p-4">
            

            {/* cluster header */}
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row">
                <div className="mr-4">
                <IdentityIcon username={data.id} width={50} style={{"backgroundColor": "#333", "borderRadius": "50%"}} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{truncateHeading(data.name)}</h1>
                  <p className="text-xs text-gray-400">Public cluster</p>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                {/* <Button variant={'outline'} 
                // onClick={() => router.push(`/cls/${clusterId}/edit`)}
                >
                  <Copy /> Clone
                </Button> */}

                <div className="hidden md:block">
                <Button>
                  <Share /> Share
                </Button>
                </div>
                <div className="block md:hidden">
                  <Button>
                    <Share />
                  </Button>
                </div>
              </div>
            </div>

            <ClusterAddToWatchlist id={data.id} accounts={data.associations.accounts} className="bg-card brightness-200" />

            {/* cluster metrics */}
            <div className="flex flex-col lg:flex-row  gap-4">
              <div className="flex flex-col lg:w-1/2 gap-4">
                <ClusterBalanceCard balanceUsd={data.financials.balanceUsd} />
                
              </div>
              <ClusterPnlCard pnlPerc={data.financials.pnlPerc} pnlUsd={data.financials.pnlUsd} unrealizedPnlUsd={data.financials.unrealizedPnlUsd} />
              {/* <ClusterAchievements achievements={data.achievements} className="lg:w-2/3 flex" /> */}
            </div>
            
            {/* metrics */}

            <Tabs defaultValue="accounts" className="flex w-full">
              <TabsList>
                <TabsTrigger value="accounts" className="cursor-pointer">Associated accounts</TabsTrigger>
                <TabsTrigger value="holdings" className="cursor-pointer">Top holdings</TabsTrigger>
                {/* <TabsTrigger value="transactions">Recent transactions</TabsTrigger> */}
              </TabsList>
              <TabsContent value="accounts">
                <ClusterAssociatedAccounts accounts={data.associations.accounts} accountLinks={data.associations.accountLinks} className="w-full flex" />
              </TabsContent>
              <TabsContent value="holdings">
                <ClusterTopHoldings holdings={data.financials.holdings} className="w-full flex" />
              </TabsContent>
              {/* <TabsContent value="transactions">
                <ClusterRecentTransactions txs={data.txs} className="w-full flex" />
              </TabsContent> */}
            </Tabs>

          </div>

          }
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
  )
}
