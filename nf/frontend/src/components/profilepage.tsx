import { motion } from 'framer-motion'
import { Github, Twitter, Phone, GraduationCap, MapPin, UserRoundIcon as UserRoundPen, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

const profileData = {
  name: 'John Doe',
  image: '/placeholder.svg?height=200&width=200',
  address: 'New York, NY',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  gpa: 3.8,
  college: 'University of Technology',
  appliedCompanies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
  contactNumber: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  bio: 'Passionate software engineer with a keen interest in AI and machine learning. Always eager to learn and tackle new challenges.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'AWS'],
  experience: [
    { company: 'Tech Innovators Inc.', role: 'Software Engineer', duration: '2020 - Present' },
    { company: 'StartUp Solutions', role: 'Junior Developer', duration: '2018 - 2020' }
  ]
}

export default function Profile() {
  const [appliedCompanies, setAppliedCompanies] = useState<string[]>([])
  const [name, setName] = useState<string>("")
  const [gpa, setGpa] = useState<number>()
  const { toast } = useToast()

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getUserDetails', {
          withCredentials: true
        })
        
        setName(response.data.username)
        setGpa(response.data.gpa)
      } catch (error) {
        toast({
          title: 'Error in fetching user details',
          variant: 'destructive'
        })
      }
    }

    const getAppliedCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/appliedData', {
          withCredentials: true
        })

        const companyNames = response.data.map((company: { name: string }) => company.name)


        setAppliedCompanies(companyNames)
      } catch (error) {
        toast({
          title: 'Error in fetching applied companies',
          variant: 'destructive'
        })
      }
    }

    getAppliedCompanies()
    getUserDetails()
  }, [toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 pb-24 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <Card className="w-full overflow-hidden bg-gray-800 text-white">
          <CardHeader className="flex flex-col items-center bg-gradient-to-r from-purple-500 to-pink-500 pb-6 pt-10 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              className="mb-4 rounded-full border-4 border-white bg-white shadow-xl sm:mb-0 sm:mr-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <UserRoundPen width={120} height={120} className='rounded-full text-gray-800' />
            </motion.div>
            <CardTitle className="text-center text-3xl font-bold text-white sm:text-left">
              {name || profileData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">About Me</h2>
              <p className="text-gray-300">{profileData.bio}</p>
              <div className="mt-6 space-y-2">
                <InfoItem icon={<MapPin className="h-5 w-5" />} text={profileData.address} />
                <InfoItem icon={<Mail className="h-5 w-5" />} text={profileData.email} />
                <InfoItem icon={<Phone className="h-5 w-5" />} text={profileData.contactNumber} />
                <InfoItem
                  icon={<Github className="h-5 w-5" />}
                  text="GitHub"
                  link={profileData.github}
                />
                <InfoItem
                  icon={<Twitter className="h-5 w-5" />}
                  text="Twitter"
                  link={profileData.twitter}
                />
                <InfoItem
                  icon={<GraduationCap className="h-5 w-5" />}
                  text={`${profileData.college} (GPA: ${gpa || profileData.gpa})`}
                />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <h2 className="mb-4 mt-6 text-2xl font-semibold">Experience</h2>
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="rounded-lg bg-gray-700 p-4">
                    <h3 className="font-semibold">{exp.company}</h3>
                    <p className="text-sm text-gray-300">{exp.role}</p>
                    <p className="text-sm text-gray-400">{exp.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardContent className="bg-gray-700 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Applied Companies</h2>
            <div className="flex flex-wrap gap-2">
              {appliedCompanies.length > 0 ? appliedCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {company}
                  </Badge>
                </motion.div>
              )) : profileData.appliedCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {company}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function InfoItem({ icon, text, link }: { icon: React.ReactNode; text: string; link?: string }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {icon}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          {text}
        </a>
      ) : (
        <span className="text-gray-300">{text}</span>
      )}
    </motion.div>
  )
}