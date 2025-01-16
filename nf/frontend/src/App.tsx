import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignInForm from './components/sign-in'
import SignUpForm from './components/sign-up'
import Dashboard from './components/dashboard'
import { AuthProvider, useAuth } from './components/context/AuthProvider'
import { Toaster } from "@/components/ui/toaster"
import Profile from './components/profilepage'
import { Layout } from './Layout'
import AdminDashboard from './components/admin-profilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="/login" element={
        <PublicRoute>
          <SignInForm />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUpForm />
        </PublicRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

