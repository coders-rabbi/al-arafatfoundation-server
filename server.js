const axios = require("axios");
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

// Update Order Status
app.patch("/orders/:id/status", async (req, res) => {
    try {
        const orderID = req.params.id;

        const { orderStatus } = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(orderID)) {
            return res.status(400).send({
                success: false,
                message: "Invalid Order ID",
            });
        }

        // Validate Status
        const validStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
        ];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).send({
                success: false,
                message: "Invalid order status",
            });
        }

        const database = await connectDB();

        const orderCollection = database.collection("order");

        // Update order
        const result = await orderCollection.updateOne(
            {
                _id: new ObjectId(orderID),
            },
            {
                $set: {
                    orderStatus,
                    updatedAt: new Date(),
                },
            }
        );

        // যদি order না পাওয়া যায়
        if (result.matchedCount === 0) {
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }

        res.send({
            success: true,
            message: "Order status updated successfully",
            modifiedCount: result.modifiedCount,
        });

    } catch (error) {

        console.log("Update Order Error:", error);

        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

const axios = require("axios");

app.post("/webhook", async (req, res) => {
    try {
        console.log(
            "TOKEN EXISTS:",
            !!process.env.PAGE_ACCESS_TOKEN
        );

        console.log(
            "TOKEN LENGTH:",
            process.env.PAGE_ACCESS_TOKEN?.length
        );

        const body = req.body;

        if (body.object === "page") {
            for (const entry of body.entry) {
                for (const webhookEvent of entry.messaging) {
                    const senderId = webhookEvent.sender.id;

                    if (webhookEvent.message?.text) {
                        const userMessage = webhookEvent.message.text;

                        console.log("User Message:", userMessage);

                        await axios.post(
                            `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                            {
                                recipient: {
                                    id: senderId,
                                },
                                message: {
                                    text: "👋 Welcome to Flame Street Wear!",
                                },
                            }
                        );

                        console.log("Reply Sent Successfully");
                    }
                }
            }

            return res.sendStatus(200);
        }

        return res.sendStatus(404);
    } catch (error) {
        console.error(
            "Messenger Reply Error:",
            error.response?.data || error.message
        );

        return res.sendStatus(500);
    }
});

app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully!");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});


// Export for Vercel
module.exports = app;


// Local Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});