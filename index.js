import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import session from 'express-session'
import MongoStore from "connect-mongo";
import connectDB from "./DB/mongoose.js";
import authRouter from "./routes/auth.routes.js";
import mainRouter from './routes/main.routes.js';
import taskRoutes from "./routes/task.routes.js";
import subMainRoutes from "./routes/submain.routes.js";
import kaderRouter from "./routes/kader.routes.js";
import deadlineRouter from "./routes/deadline.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add Middleware
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://taqat-eight.vercel.app",
    "https://taqat-website-3wara.vercel.app",
    "https://taqat-pi.vercel.app"
  ], 
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization' , 'Access-Control-Allow-Origin'], // Allowed headers
  credentials: true // Allow credentials
}));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
        cookie: {
            secure: false, // Change to true in production with HTTPS
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Add Routes
app.use('/api/auth', authRouter);
app.use('/api/main', mainRouter);
app.use('/api/tasks' , taskRoutes)
app.use('/api/sub-main' , subMainRoutes)
app.use('/api/kader' , kaderRouter)
app.use('/api/deadline' , deadlineRouter)

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
