import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, BriefcaseIcon, DollarSign, FileText, GraduationCap, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

interface AdminCompanyAddProps {
  onClose: () => void
}

export default function AdminCompanyAdd({ onClose }: AdminCompanyAddProps) {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    description: '',
    jobRole: '',
    criteria: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:3000/addCompanies', {
        name: formData.name,
        salary: parseInt(formData.salary),
        description: formData.description,
        jobRole: formData.jobRole,
        criteria: parseFloat(formData.criteria),
      }, {
        withCredentials: true
      })

      if (response.status === 200) {
        toast({
          title: "Company Added Successfully",
          description: `${formData.name} has been added to the database.`,
          variant: "default",
        })
        onClose()
      }
    } catch (error) {
      console.error('Error adding company:', error)
      toast({
        title: "Error Adding Company",
        description: "There was an error adding the company. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="sm:max-w-[425px] w-full mx-4 bg-gray-900/95 backdrop-blur-xl text-white space-y-4 rounded-lg shadow-lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-200">
              Company Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter company name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium text-gray-200">
              Salary
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter annual salary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobRole" className="text-sm font-medium text-gray-200">
              Job Role
            </Label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter job role"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-200">
              Description
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="pl-10 min-h-[100px] bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter job description"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="criteria" className="text-sm font-medium text-gray-200">
              GPA Criteria
            </Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="criteria"
                name="criteria"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.criteria}
                onChange={handleInputChange}
                className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter minimum GPA required"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Company'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

