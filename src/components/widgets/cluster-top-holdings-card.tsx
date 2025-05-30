import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Copy, List, Network } from "lucide-react"
import { abbreviateAddress } from "@/lib/formatting"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { abbreviateNumber } from "@/lib/formatting"
import { toast } from "sonner"
import { handleCopy } from "@/lib/utils/copy-to-clipboard"

function HoldingsTable({ holdings }: { holdings: any[] }) {
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>CA</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Bought</TableHead>
          <TableHead>Sold</TableHead>
          <TableHead>P&L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((holding) => (
          <TableRow key={holding.ca}>
            <TableCell>
              <div className="flex flex-row">
              <Avatar className="size-5 rounded-lg mr-4">
                <AvatarImage src={holding.imageUrl} alt={holding.symbol} />
                <AvatarFallback className="rounded-lg">{holding.symbol}</AvatarFallback>
              </Avatar>
              <p>{holding.symbol}</p>
              </div>
            </TableCell>
            <TableCell>
              { abbreviateAddress(holding.ca) }
              <Button
                variant={'link'}
                className="size-5"
                onClick={(e) => handleCopy(e, holding.ca)}
              ><Copy /></Button>
            </TableCell>
            <TableCell>${ abbreviateNumber(holding.valueUsd) }</TableCell>
            <TableCell>${ abbreviateNumber(holding.boughtUsd) }</TableCell>
            <TableCell>${ abbreviateNumber(holding.soldUsd) }</TableCell>
            <TableCell>${ abbreviateNumber(holding.pnlUsd) }</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


export function ClusterTopHoldings({
    holdings, ...props
  }: {holdings: any[], className: string}
) {


    return (
    <Card {...props}>
        <CardHeader>
            <div className="flex flex-row justify-between">
                <CardTitle>Top holdings</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4">
            <HoldingsTable holdings={holdings} />
        </CardContent>
    </Card>
    )
}