import mongoose from "mongoose";

const DB_NAME = "testing";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://harsh:harsh6969@cluster0.bckbv.mongodb.net/${DB_NAME}`);
        console.log("MongoDB Connected: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
}

export default connectDB;