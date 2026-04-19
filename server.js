const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

// MIDDLEWARE
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
        db = client.db("al-arafat-foundation");
    }
    return db;
}

// Routes
app.get('/', (req, res) => {
    res.send('Hello Al Arafat Foundation!');
});

app.get("/blogs", async (req, res) => {
    try {
        const database = await connectDB();
        const allBlogs = database.collection("blogs");
        const result = await allBlogs.find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Vercel-এর জন্য এটি সবচেয়ে গুরুত্বপূর্ণ
module.exports = app;

// লোকালি চালানোর জন্য
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}