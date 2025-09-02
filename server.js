import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import schoolRoutes from './routes/schoolRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/schoolImages', express.static(path.join(__dirname, 'schoolImages')));
app.use('/api', schoolRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));