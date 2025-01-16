import express from 'express'
import { getAllUserDetails, getUserDetails, loginUser, logout, registerUser } from './controllers/usercontroller.js';
import { isAuthenticated,isAdmin } from './middleware/auth.js';
import { addCompanies,apply,getAppliedCompanies,fetchCompanyData, deleteCompanies } from './controllers/dashboardcontroller.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.post('/signup',registerUser);
app.post('/login',loginUser);
app.post('/logout',isAuthenticated,logout);
app.get('/getUserDetails',isAuthenticated,getUserDetails);
app.get('/getAllUsers',isAuthenticated,isAdmin,getAllUserDetails);

app.post('/addCompanies',isAuthenticated,isAdmin,addCompanies);
app.get('/fetchData',isAuthenticated,fetchCompanyData);
app.get('/appliedData',isAuthenticated,getAppliedCompanies);
app.delete('/deletecompanies',isAuthenticated,isAdmin,deleteCompanies);
app.post('/apply',isAuthenticated,apply);
app.get('/companiesData',isAuthenticated,isAdmin,fetchCompanyData);

export {app};