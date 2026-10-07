const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        await connectDB();
        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`🚀 Persona AI Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
