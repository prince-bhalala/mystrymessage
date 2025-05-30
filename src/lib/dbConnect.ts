import { console } from "inspector";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database")
        return
    }

    try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || '',{})
       console.log("DataBase"+db)
       console.log("DataBase Connections"+db.connections)
       connection.isConnected = db.connections[0].readyState
       console.log("DB Connected Successfully")
    } catch (error) {
        console.log("DataBase connection failed",error)
        process.exit(1)
    }
}

export default dbConnect;