import { Router } from 'express';
import { getSchools, createSchool , updateSchool, deleteSchool} from '../controllers/schoolController.js';
import upload from '../utils/multer.js';

const router = Router();


router.get('/schools', getSchools);
router.post('/schools', upload.single('image'), createSchool);
router.put("/schools/:id", upload.single("image"), updateSchool);
router.delete("/schools/:id", deleteSchool);

export default router;