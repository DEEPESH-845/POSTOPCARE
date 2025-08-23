const http = require("http");
const app = require("./app");
const { initializeDatabase } = require("./db/init");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		await initializeDatabase();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Server startup error:", error);
	}
}

startServer();
