const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdtg0ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");

        db = client.db("al-arafat-foundation");
    }
    return db;
}

// Routes
app.get("/", (req, res) => {
    res.send("Hello Al Arafat Foundation!");
});

// Blogs Route
app.get("/blogs", async (req, res) => {
    try {
        const database = await connectDB();
        const blogsCollection = database.collection("blogs");

        const result = await blogsCollection.find().toArray();

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Products Route
app.get("/products", async (req, res) => {
    try {
        const database = await connectDB();
        const productsCollection = database.collection("products");

        const result = await productsCollection.find().toArray();

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Export for Vercel
module.exports = app;

// Local Server
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}