import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuth } from './context/AuthProvider'
import { LogOut, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AdminCompanyAdd from './addCompany'
import { Checkbox } from './ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import CompanyDrawer from './company-drawer'

interface Company {
  id: string
  name: string
  salary: number
  description: string
  jobRole: string
  criteria: number
}

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'ascending' | 'descending' } | null>(null)
  const {setUser} = useAuth();
  const admin = Cookies.get('admin');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const {toast} = useToast();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    
  useEffect(() => {
    const fetchCompanies = async() => {
        const response = await axios.get('http://localhost:3000/fetchData',{
            withCredentials:true
        })
        
        setCompanies(response.data)
    }

    fetchCompanies();
  }, [companies])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortCompanies = (key: keyof Company) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
    return 0
  })

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('admin');
    setUser(null);
  }

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const handleDeleteCompanies = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/deleteCompanies', {
        data: { companyIds: selectedCompanies },
        withCredentials: true
      })

      if(response.status === 200) {
        toast({
          title: 'Data deleted successfully',
          variant: 'destructive'
        })
      }

      setCompanies(companies.filter(company => !selectedCompanies.includes(company.name)))
    } catch (error) {
      console.error('Error deleting companies:', error)
    }
  }

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Company Dashboard</h1>
            <div className="flex gap-4">
              {admin !== 'false' && (
                <>
                  <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <AdminCompanyAdd onClose={() => setIsAddCompanyOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    onClick={handleDeleteCompanies} 
                    variant="outline" 
                    className="bg-pink-500 text-white hover:bg-pink-600"
                    disabled={selectedCompanies.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </>
              )}
              <Button onClick={handleLogout} variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search companies or job roles..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8 pr-4 py-2 w-64 bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white bg-opacity-20 text-white hover:bg-opacity-30">
                  Sort By <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => sortCompanies('name')}>Company Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortCompanies('salary')}>Salary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortCompanies('jobRole')}>Job Role</DropdownMenuItem>
                <DropdownMenuItem onClick={() => sortCompanies('criteria')}>GPA</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of companies and their job offerings.</TableCaption>
              <TableHeader>
                <TableRow>
                  {admin !== 'false' && <TableHead className="w-[50px]">Select</TableHead>}
                  <TableHead>Company Name</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>GPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCompanies.map((company) => (
                  <TableRow key={company.id} className="cursor-pointer" onClick={() => handleCompanyClick(company)}>
                    {admin !== 'false' && (
                      <TableCell>
                        <Checkbox
                          onCheckedChange={() => handleSelectCompany(company.name)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.jobRole}</TableCell>
                    <TableCell>${company.salary.toLocaleString()}</TableCell>
                    <TableCell>{company.description}</TableCell>
                    <TableCell>{company.criteria.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      <Sheet open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-transparent border-none">
          {selectedCompany && <CompanyDrawer company={selectedCompany} />}
        </SheetContent>
      </Sheet>
      </div>
    </div>
  )
}

