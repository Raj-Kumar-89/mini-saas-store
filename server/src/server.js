require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT =  process.env.PORT || 5000;

async function startServer(){
    try{
        await db.raw("SELECT 1");

        app.listen(PORT, () => {
            console.log(`Server running at PORT: ${PORT}`);
        });
    }
    catch(error){
        console.error("Failed to connect PostgreSQL: ", error.message);
        process.exit(1);
    }
}

startServer();