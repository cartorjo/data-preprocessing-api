import express from 'express';
import dataRoutes from './routes/dataRoutes';
import { preprocessData } from './preprocess';

const app = express();
const PORT = process.env.PORT || 3000;

// Run preprocessing to generate the cleaned data file
preprocessData();

// Use data routes
app.use('/api', dataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});