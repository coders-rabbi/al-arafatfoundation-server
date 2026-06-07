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
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Mongo URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdtg0ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

// DB CONNECT
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

// ROOT
app.get("/", (req, res) => {
    res.send("Hello Al Arafat Foundation!");
});


// ================= BLOG =================
app.get("/blogs", async (req, res) => {
    try {
        const database = await connectDB();
        const result = await database.collection("blogs").find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// ================= PRODUCTS =================
app.get("/products", async (req, res) => {
    try {
        const database = await connectDB();
        const result = await database.collection("products").find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// FIXED ROUTE
app.get("/products/:id", async (req, res) => {
    try {
        const database = await connectDB();
        const id = Number(req.params.id);

        const result = await database.collection("products").findOne({ id });

        if (!result) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// ================= ORDERS =================
app.post("/orders", async (req, res) => {
    try {
        const orderData = req.body;

        if (!orderData || Object.keys(orderData).length === 0) {
            return res.status(400).send({ message: "Order data is required" });
        }

        const database = await connectDB();
        const result = await database.collection("order").insertOne(orderData);

        res.status(201).send({
            message: "Order created successfully",
            insertedId: result.insertedId,
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/orders/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Order ID" });
        }

        const database = await connectDB();

        const result = await database.collection("order").findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return res.status(404).send({ message: "Order not found" });
        }

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get("/orders_data", async (req, res) => {
    try {
        const database = await connectDB();
        const result = await database.collection("order").find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.patch("/orders/:id/status", async (req, res) => {
    try {
        const id = req.params.id;
        const { orderStatus } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Order ID" });
        }

        const validStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
        ];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).send({ message: "Invalid status" });
        }

        const database = await connectDB();

        const result = await database.collection("order").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    orderStatus,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Order not found" });
        }

        res.send({
            success: true,
            message: "Updated successfully",
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// ================= FAQ =================
function getFAQResponse(message) {
    const text = (message || "").toLowerCase();

    if (
        text.includes("track") ||
        text.includes("tracking") ||
        text.includes("order status") ||
        text.includes("অর্ডার ট্র্যাক")
    ) {
        return "📦 আপনার Order ID পাঠান।";
    }

    if (
        (text.includes("order") || text.includes("অর্ডার")) &&
        !text.includes("track")
    ) {
        return `🛒 অর্ডার করতে আমাদের ওয়েবসাইট ভিজিট করুন:

https://flame-bd.com

পছন্দের টি-শার্ট নির্বাচন করে Checkout সম্পন্ন করুন।`;
    }

    if (text.includes("delivery")) {
        return "🚚 আমরা সারা বাংলাদেশে ডেলিভারি করি।";
    }

    if (text.includes("payment")) {
        return "💵 Cash on Delivery Available.";
    }

    if (text.includes("size") || text.includes("মাপ")) {
        return "📏 আপনার height ও weight বলুন।";
    }

    return null;
}


// ================= AI =================
async function getAIResponse(userMessage) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are Flame Street Wear support assistant.
Reply in Bangla, short answers only.
`,
                },
                { role: "user", content: userMessage },
            ],
            max_tokens: 150,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.log("OpenAI Error:", error.message);
        return "AI এখন unavailable। পরে চেষ্টা করুন।";
    }
}


// ================= PRODUCT RECOMMEND =================
async function getProductRecommendation(message) {
    try {
        const res = await axios.get(
            "https://al-arafatfoundation-server-production.up.railway.app/products"
        );

        const products = res.data;
        const text = message.toLowerCase();

        let color = null;

        if (text.includes("black") || text.includes("কালো")) color = "black";
        else if (text.includes("white") || text.includes("সাদা")) color = "white";
        else if (text.includes("green") || text.includes("সবুজ")) color = "bottle green";
        else if (text.includes("maroon") || text.includes("মেরুন")) color = "maroon";

        if (!color) return null;

        const matched = products.filter(
            (p) => p?.variation?.color?.toLowerCase() === color
        );

        if (!matched.length) return null;

        return matched.slice(0, 3).map(p =>
            `🛒 ${p.basicInfo.productName}
💰 ${p.pricingInventory.discountPrice}
🎨 ${p.variation.color}`
        ).join("\n\n");

    } catch (err) {
        console.log("Product Error:", err.message);
        return null;
    }
}


// ================= ORDER TRACK =================
async function getOrderTracking(orderId) {
    try {
        const res = await axios.get(
            `https://al-arafatfoundation-server-production.up.railway.app/orders/${orderId}`
        );

        return `📦 Order Status: ${res.data.orderStatus}`;
    } catch (err) {
        return null;
    }
}


// ================= WEBHOOK =================
app.post("/webhook", async (req, res) => {
    try {
        const body = req.body;

        if (body.object === "page") {
            for (const entry of body.entry) {
                for (const event of entry.messaging) {
                    const senderId = event.sender.id;

                    if (!event.message?.text) continue;

                    const msg = event.message.text;

                    const isObjectId = /^[a-f0-9]{24}$/i.test(msg);

                    let reply = null;

                    if (isObjectId) {
                        reply = await getOrderTracking(msg);
                    }

                    if (!reply) reply = getFAQResponse(msg);
                    if (!reply) reply = await getProductRecommendation(msg);
                    if (!reply) reply = await getAIResponse(msg);

                    await axios.post(
                        `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                        {
                            recipient: { id: senderId },
                            message: { text: reply },
                        }
                    );
                }
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.log("Webhook Error:", error.message);
        res.sendStatus(500);
    }
});


// ================= VERIFY =================
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});


// EXPORT
module.exports = app;


// START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on", port));