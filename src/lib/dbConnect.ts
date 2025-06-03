// import mongoose from 'mongoose';

// type ConnectionObject = {
//   isConnected?: number;
// };

// const connection: ConnectionObject = {};

// async function dbConnect(): Promise<void> {
//   // Check if we have a connection to the database or if it's currently connecting
//   if (connection.isConnected) {
//     console.log('Already connected to the database');
//     return;
//   }

//   try {
//     // Attempt to connect to the database
//     const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

//     connection.isConnected = db.connections[0].readyState;

//     console.log('Database connected successfully');
//   } catch (error) {
//     console.error('Database connection failed:', error);

//     // Graceful exit in case of a connection error
//     process.exit(1);
//   }
// }

// export default dbConnect;
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseCache
}

let cached = globalWithMongoose.mongoose

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  }
  globalWithMongoose.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI || '', {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
