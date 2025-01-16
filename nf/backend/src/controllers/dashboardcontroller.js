import Company from "../models/companiesmodel.js";
import User from "../models/usermodel.js";

const fetchCompanyData = async(req,res) => { // for eligible companies
    try {
        const user_id = req.user._id;
        const user = await User.findById(user_id);
        const gpa = Number(user.gpa);
        const companies = await Company.find({
            criteria: {
                $lte : gpa
            }
        })

        return res.status(200).json(companies)
    } catch (error) {
        console.log('Error in fetching data',error);
    }
}

const apply = async (req, res) => {
    try {
        const userId = req.user._id;
        const companyName = req.body.company;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const company = await Company.findOne({ name: companyName });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (user.companies.includes(company._id)) {
            return res.status(400).json({ message: "Already applied to this company" });
        }

        company.applicants.push(user._id);
        user.companies.push(company._id);
        await user.save();
        await company.save();

        return res.status(200).json({ message: "Successfully applied to this company" });
    } catch (error) {
        console.error("Error in applying:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAppliedCompanies = async(req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const companies = user.companies;
        const companiesData = await Company.find({
            _id: {
                $in: companies
            },
        }).select('name -_id');
        return res.status(200).json(companiesData);
    } catch (error) {
        console.log('Error in getting applied companies',error);
    }
}

const addCompanies = async(req,res) => {
    try {
        const {name,salary,jobRole,description,criteria} = req.body;
        if(!name || !salary || !jobRole || !description || !criteria) {
            return res.status(400).json({message:"Please provide all the details"});
        }

        const company = await Company.create({
            name,salary,jobRole,description,criteria
        });

        return res.status(200).json(company);
    } catch (error) {
        console.log('Error in adding companies',error);
    }
}

const deleteCompanies = async(req,res) => {
    try {
        const {companyIds} = req.body;
        const companies_toDelete = await Company.deleteMany({
            name: {$in:companyIds}
        })

        return res.status(200).json({
            message:"Deleted Successfully"
        })

    } catch (error) {
        console.log("Error in deletion",error);
    }
}

const fetchCompaniesData = async(req,res) => {
    try {
        const companies = await Company.find({});
        return res.status(200).json(companies);
    } catch (error) {
        console.log('Error in fetching companies data',error);
    }
}


export {fetchCompanyData,apply,getAppliedCompanies,addCompanies,deleteCompanies,fetchCompaniesData}