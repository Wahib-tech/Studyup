const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const fullCleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log('Collections to clear:', collectionNames);

        for (const name of collectionNames) {
            await mongoose.connection.db.collection(name).deleteMany({});
            console.log(`- Deleted all documents from "${name}"`);
        }

        console.log('Database cleanup complete! Every collection is now empty.');
        process.exit(0);
    } catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
    }
};

fullCleanup();
