import { useState, useEffect, useRef } from "react"
import cytoscape from 'cytoscape';
import { List, Network } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { abbreviateAddress } from "@/lib/formatting"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { abbreviateNumber, formatGainLoss } from "@/lib/formatting"
import { IAccountEditable, IAccountLink } from "@/types/cluster";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function AccountsTable({accounts, onToggle}: {accounts: IAccountEditable[], onToggle: (address: string) => void}) {
    return (
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Included</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.address}>
              <TableCell className="font-medium">{abbreviateAddress(account.address)}</TableCell>
              <TableCell>${ abbreviateNumber(account.volumeUsd) }</TableCell>
              <TableCell className="flex flex-row">
                <Switch
                  id={`acc-${account.address}`}
                  className="cursor-pointer data-[state=checked]:bg-green-500 mr-2"
                  checked={account.isIncluded}
                  onClick={() => { onToggle( account.address )}}
                />
                <Label htmlFor={`acc-${account.address}`}>{ account.isIncluded ? "Included" : "Ignored" }</Label>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}


function AccountsGraph({accounts, accountLinks}: {accounts: IAccountEditable[], accountLinks: IAccountLink[]}) {
  const graphRef = useRef(null)
  
  const nodes = accounts.map(account => ({
    "data": {
      "id": account.address,
      "label": abbreviateAddress(account.address)
    }
  }))

  const edges = accountLinks.map(link => ({
    "data": {
      "id": `${link.source}-${link.target}`,
      "source": link.source,
      "target": link.target
    }
  }))

  const drawGraph = () => {
    const cy = cytoscape({
      container: graphRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#fff'
          }
        },
      ]
     })
     cy.panningEnabled( false );
    }
   
    useEffect(() => {
     drawGraph()
    }, [])

    useEffect(() => {
      // TODO: cy.center() works a little better
      window.addEventListener("resize", drawGraph);
      return () => window.removeEventListener("resize", drawGraph); // Cleanup
    })

    return (
      <div ref={graphRef} className="w-full aspect-[2/1]" />
    )

}

export function ClusterAssociatedAccountsWizard({
    accounts, accountLinks, onToggle, ...props
  }: {accounts: IAccountEditable[], accountLinks: IAccountLink[], onToggle: (address: string) => void, className: string}
) {
  const [assocAccVewMode, setAssocAccVewMode] = useState('list')

  return (
  <Card {...props}>
      <CardHeader>
          <div className="flex flex-row justify-between">
              <CardTitle>Associated accounts</CardTitle>
              {/* <div className="flex flex-row gap-2">
              <Button variant={ assocAccVewMode === "list" ? "default" : "outline" } onClick={() => setAssocAccVewMode("list")} size="icon">
                  <List />
              </Button>
              <Button variant={ assocAccVewMode === "graph" ? "default" : "outline" } onClick={() => setAssocAccVewMode("graph")} size="icon">
                  <Network />
              </Button>
              </div> */}
          </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {
        assocAccVewMode === "list" ? 
          <AccountsTable accounts={accounts} onToggle={onToggle} /> : 
          null
          // <AccountsGraph accounts={accounts} accountLinks={accountLinks} />
        }
      </CardContent>
  </Card>
  )
}