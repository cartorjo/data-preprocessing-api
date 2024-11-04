import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const outputFilePath = path.join(__dirname, '../../cleaned_data.json');

// Endpoint to get the cleaned data from the single file
router.get('/data', (req: Request, res: Response) => {
    if (fs.existsSync(outputFilePath)) {
        const cleanedData = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
        res.json(cleanedData);
    } else {
        res.status(404).json({ error: 'Data not found. Please run preprocessing first.' });
    }
});

export default router;