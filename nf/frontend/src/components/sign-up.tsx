import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useAuth } from "./context/AuthProvider"
import { ArrowRight, User, Mail, KeyRound, GraduationCap, ShieldCheck } from 'lucide-react'

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gpa, setGpa] = useState("")
  const [admin, setAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSignup = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(
        "http://localhost:3000/signup",
        {
          username: name,
          email: email,
          password: password,
          gpa: parseFloat(gpa),
          isAdmin: admin,
        },
        {
          withCredentials: true,
        }
      )

      if (response.data.success) {
        const { token, user } = response.data
        Cookies.set("token", token, { expires: 7, secure: true })
        Cookies.set("user", user._id, { expires: 7, secure: true })
        Cookies.set("admin", user.admin, { expires: 7, secure: true })
        setUser(user)
        navigate("/", { replace: true })
      }
    } catch (error) {
      console.log("Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-0 bg-black/60 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-200"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="username"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gpa"
                  className="text-sm font-medium text-gray-200"
                >
                  GPA
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="Your GPA"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center">
                  <Checkbox
                    id="admin"
                    checked={admin}
                    onCheckedChange={(checked) => setAdmin(checked as boolean)}
                    className="border-gray-800 text-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Label htmlFor="admin" className="text-sm font-medium text-gray-200">
                  Register as Admin
                </Label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex w-full justify-between gap-4">
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

