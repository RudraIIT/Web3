import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import axios from 'axios'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface Company {
    name: string
    applicants: number
}

interface Student {
    id: string
    name: string
    appliedCompanies: string[]
}

export default function AdminDashboard() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [newCompany, setNewCompany] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        const getCompanyDetails = async () => {
            try {
                const response = await axios.get('http://localhost:3000/companiesData', {
                    withCredentials: true
                })
                const companyData: Company[] = response.data.map((company: { name: string; applicants: any[] }) => ({
                    name: company.name,
                    applicants: company.applicants.length,
                }));

                setCompanies(companyData)
                toast({
                    title: "Company details fetched successfully",
                    variant: "default"
                })
            } catch (error) {
                console.log("Error", error);
                toast({
                    title: "Error fetching company details",
                    variant: "destructive"
                })
            }
        }

        const getAllStudents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getAllUsers', {
                    withCredentials: true
                })

                const studentsData: Student[] = response.data.map((student: { id: string, username: string, companies: string[] }) => ({
                    id: student.id,
                    name: student.username,
                    appliedCompanies: student.companies,
                }));

                setStudents(studentsData)
                
                toast({
                    title: "Student details fetched successfully",
                    variant: "default"
                })
            } catch (error) {
                console.log("Error", error);
                toast({
                    title: "Error fetching student details",
                    variant: "destructive"
                })
            }
        }
        getAllStudents()
        getCompanyDetails()
    }, [])

    const addCompany = () => {
        if (!newCompany.trim()) return
        const updatedCompanies = [...companies, { name: newCompany, applicants: 0 }]
        setCompanies(updatedCompanies)
        setNewCompany('')
        toast({
            title: 'Company added successfully',
            variant: 'default',
        })
    }

    const chartData = {
        labels: companies.map(company => company.name),
        datasets: [
            {
                label: 'Number of Applicants',
                data: companies.map(company => company.applicants),
                backgroundColor: 'rgba(147, 51, 234, 0.6)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 1,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                },
            },
            title: {
                display: true,
                text: 'Student Applications per Company',
                color: 'rgba(255, 255, 255, 0.8)',
            },
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255, 255, 255, 0.8)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
                ticks: { color: 'rgba(255, 255, 255, 0.8)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 pb-24 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto"
            >
                <h1 className="mb-6 text-3xl font-bold text-center">Admin Dashboard</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-gray-800 text-white border-none">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
                            <CardTitle>Company Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Bar data={chartData} options={chartOptions} />
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 text-white border-none">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
                            <CardTitle>Add New Company</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-end space-x-2">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="company" className="text-white">Company Name</Label>
                                    <Input
                                        type="text"
                                        id="company"
                                        value={newCompany}
                                        onChange={(e) => setNewCompany(e.target.value)}
                                        placeholder="Enter company name"
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <Button onClick={addCompany} className="bg-purple-500 hover:bg-purple-600">Add</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6 bg-gray-800 text-white border-none">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <CardTitle>Student List</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {students.map((student) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between border-b border-gray-700 pb-2"
                                >
                                    <span>{student.name}</span>
                                    <div className="flex space-x-2">
                                        {student.appliedCompanies.map((company, index) => (
                                            <Badge key={index} variant="secondary" className="bg-purple-500 text-white">
                                                {company}
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

