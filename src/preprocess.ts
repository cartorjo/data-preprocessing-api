import * as fs from 'fs';
import * as path from 'path';

interface QAPair {
    subject: string;
    description: string;
    created_at: string;
    tags: string[];
    status: string;
}

// Function to load, preprocess, and categorize data by "status"
export function preprocessData(): void {
    const dataFolder = path.join(__dirname, '../data');
    const outputBasePath = path.join(__dirname, '../categorized_data'); // Base folder for categorized data
    let qaPairs: QAPair[] = [];

    // Load and parse each JSON file
    fs.readdirSync(dataFolder).forEach((file) => {
        if (file.endsWith('.json')) {
            const data = JSON.parse(fs.readFileSync(path.join(dataFolder, file), 'utf-8'));

            // Extract meaningful fields
            const subject = data.subject;
            const description = data.description;
            const created_at = data.created_at;
            const tags = data.tags || [];
            const status = data.status;

            // Add to the array if essential fields are present
            if (subject && description && created_at && status) {
                qaPairs.push({
                    subject: cleanText(subject),
                    description: cleanText(description),
                    created_at,
                    tags: tags.map(cleanText),
                    status: cleanText(status),
                });
            }
        }
    });

    // Group data by "status"
    const categorizedData: Record<string, QAPair[]> = {};
    qaPairs.forEach((pair) => {
        const status = pair.status;
        if (!categorizedData[status]) {
            categorizedData[status] = [];
        }
        categorizedData[status].push(pair);
    });

    // Create output folders and save categorized data
    if (!fs.existsSync(outputBasePath)) {
        fs.mkdirSync(outputBasePath);
    }

    for (const [status, pairs] of Object.entries(categorizedData)) {
        const statusFolder = path.join(outputBasePath, status);

        // Create a folder for each status if it doesn't exist
        if (!fs.existsSync(statusFolder)) {
            fs.mkdirSync(statusFolder);
        }

        // Save the data for each status in a single JSON file in its folder
        const outputFilePath = path.join(statusFolder, `${status}_data.json`);
        fs.writeFileSync(outputFilePath, JSON.stringify(pairs, null, 2), 'utf-8');
        console.log(`Saved ${pairs.length} entries to '${outputFilePath}'`);
    }
}

// Helper function to clean text by removing special characters and extra whitespace
function cleanText(text: string): string {
    return text.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim().toLowerCase();
}