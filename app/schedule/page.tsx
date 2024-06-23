import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  Menu,
  CircleUser,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Schedule() {

  type LinkButtonProps = {
    children: React.ReactNode,
    status: String // 부모컴포넌트에서 import 해온 타입을 재사용 해 줍시다.
  }
  const LinkButton = (props: LinkButtonProps) => {
    const { status } = props;
    switch (status){
      case 'C' :
        return (<Button disabled size="sm" className="ml-auto gap-1 w-[100px]">마감</Button>)
      case 'customer' :
        return (<Button asChild  size="sm" className="ml-auto gap-1 w-[100px]">
                      
          <Link href="#" prefetch={false}>
            신청하기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>)
      default : 
        return (<Button asChild size="sm" className="ml-auto gap-1 w-[100px]">
                      
          <Link href="#" prefetch={false}>
            신청하기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>)
    }
  }

  const reserveList = [
    {id : 0 , time : '14:00', title :'test' ,  subTitle : 'sub title', status: 'A'},
    {id : 1 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'C'},
    {id : 2 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
    {id : 3 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'C'},
    {id : 4 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
    {id : 5 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
    {id : 6 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
    {id : 7 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
    {id : 8 , time : '14:00', title :'test2' , subTitle : 'sub title', status: 'A'},
  ]
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Analytics
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link
                href="/schedule"
                className="text-muted-foreground hover:text-foreground"
              >
                일정
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>모임</CardTitle>
                <CardDescription>Recent transactions from your store.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/schedule/create" prefetch={false}>
                  만들기
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">시간</TableHead>
                    <TableHead>타이틀</TableHead>
                    <TableHead className="text-right">신청</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {
                  reserveList.map(reserve => (
                    <TableRow key={reserve.id}>
                    <TableCell>
                      <div className="font-medium">{reserve.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{reserve.title}</div>
                      <div className="text-sm text-muted-foreground">{reserve.subTitle}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <LinkButton status={reserve.status}> </LinkButton>
                    </TableCell>
                  </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}