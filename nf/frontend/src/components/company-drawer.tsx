import { Button } from "@/components/ui/button"
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Company {
    id: string
    name: string
    salary: number
    description: string
    jobRole: string
    criteria: number
}

interface CompanyDrawerProps {
    company: Company
}

export default function CompanyDrawer({ company }: CompanyDrawerProps) {
    const { toast } = useToast()

    const handleApply = async () => {
        try {
            const response = await axios.post('http://localhost:3000/apply', {
                company:company.name
            },{
                withCredentials: true
            });

            if(response.status===200) {
                toast({
                    title: "Applied Successfully",
                    description: "You have successfully applied for this job.",
                    variant: "default",
                })
            }
        } catch (error) {
            toast({
                title: "Error Applying",
                description: "There was an error applying for this job. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white h-full p-6">
            <SheetHeader>
                <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {company.name}
                </SheetTitle>
                <SheetDescription className="text-gray-300">
                    {company.jobRole}
                </SheetDescription>
            </SheetHeader>
            <div className="space-y-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="font-medium text-purple-400">Salary</h3>
                    <p className="text-lg">${company.salary.toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="font-medium text-purple-400">Description</h3>
                    <p>{company.description}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="font-medium text-purple-400">Required GPA</h3>
                    <p className="text-lg">{company.criteria.toFixed(1)}</p>
                </div>
            </div>
            <Button
                onClick={handleApply}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
                Apply Now
            </Button>
        </div>
    )
}

