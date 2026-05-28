const express = require("express");
const cors = require("cors");
const {
    MongoClient,
    ServerApiVersion,
    ObjectId,
} = require("mongodb");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdtg0ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Mongo Client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

// Connect Database
async function connectDB() {
    try {
        if (!db) {
            await client.connect();

            await client.db("admin").command({ ping: 1 });

            console.log("Connected to MongoDB!");

            db = client.db("al-arafat-foundation");
        }

        return db;
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
        throw error;
    }
}

// Root Route
app.get("/", (req, res) => {
    res.send("Hello Al Arafat Foundation!");
});


// ================= BLOG ROUTES =================

app.get("/blogs", async (req, res) => {
    try {
        const database = await connectDB();

        const blogsCollection = database.collection("blogs");

        const result = await blogsCollection.find().toArray();

        res.send(result);
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});


// ================= PRODUCT ROUTES =================

app.get("/products", async (req, res) => {
    try {
        const database = await connectDB();

        const productsCollection = database.collection("products");

        const result = await productsCollection.find().toArray();

        res.send(result);
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

// Single Product
app.get("/products/:id", async (req, res) => {
    try {
        const productID = req.params.id;

        const database = await connectDB();

        const productsCollection = database.collection("products");

        const result = await productsCollection.findOne({
            id: Number(productID),
        });

        if (!result) {
            return res.status(404).send({
                message: "Product not found",
            });
        }

        res.send(result);
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});


// ================= ORDER ROUTES =================

// Create Order
app.post("/orders", async (req, res) => {
    try {
        const orderData = req.body;

        if (!orderData || Object.keys(orderData).length === 0) {
            return res.status(400).send({
                message: "Order data is required",
            });
        }

        const database = await connectDB();

        const orderCollection = database.collection("order");

        const result = await orderCollection.insertOne(orderData);

        res.status(201).send({
            message: "Order created successfully",
            insertedId: result.insertedId,
            order: orderData,
        });
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});


// Get Single Order
app.get("/orders/:id", async (req, res) => {
    try {
        const orderID = req.params.id;

        // Validate ObjectId
        if (!ObjectId.isValid(orderID)) {
            return res.status(400).send({
                message: "Invalid Order ID",
            });
        }

        const database = await connectDB();

        const orderCollection = database.collection("order");

        const result = await orderCollection.findOne({
            _id: new ObjectId(orderID),
        });

        if (!result) {
            return res.status(404).send({
                message: "Order not found",
            });
        }

        res.send(result);
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});


// Get All Orders
app.get("/orders_data", async (req, res) => {
    try {
        const database = await connectDB();

        const orderCollection = database.collection("order");

        const result = await orderCollection.find().toArray();

        res.send(result);
    } catch (error) {
        console.log(error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});


// Export for Vercel
module.exports = app;


// Local Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});