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
app.use(cors({
origin: [
    "https://school-frontend-gia9.onrender.com",
],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use('/schoolImages', express.static(path.join(__dirname, 'schoolImages')));
app.use('/api', schoolRoutes);
app.use("/api/auth", authRoutes);


app.get('/', (req, res) => res.send('Backend is up 🎉'));
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));