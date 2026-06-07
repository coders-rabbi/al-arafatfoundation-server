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



function getFAQResponse(message) {
    const text = message.toLowerCase();

    // Order
    if (
        text.includes("order") ||
        text.includes("অর্ডার") ||
        text.includes("কিভাবে অর্ডার") ||
        text.includes("order kivabe korbo") ||
        text.includes("order korte chai") ||
        text.includes("order kivabe korbo") ||
        text.includes("order korte ki ki lagbe")
    ) {
        return `🛒 অর্ডার করতে আমাদের ওয়েবসাইট ভিজিট করুন:

https://flame-bd.com

পছন্দের টি-শার্ট নির্বাচন করে Checkout সম্পন্ন করুন।`;
    }

    if (
        text.includes("track") ||
        text.includes("tracking") ||
        text.includes("order status") ||
        text.includes("status") ||
        text.includes("অর্ডার ট্র্যাক") ||
        text.includes("অর্ডার স্ট্যাটাস")
    ) {
        return "📦 আপনার Order ID পাঠান।";
    }

    // Size
    if (
        text.includes("size") ||
        text.includes("সাইজ") ||
        text.includes("size chart") ||
        text.includes("মাপ") ||
        text.includes("লার্জ") ||
        text.includes("medium") ||
        text.includes("small") ||
        text.includes("xl")
    ) {
        return `📏 আপনার উচ্চতা ও ওজন জানালে আমরা সঠিক সাইজ সাজেস্ট করতে পারি।`;
    }

    // Delivery
    if (
        text.includes("delivery") ||
        text.includes("ডেলিভারি") ||
        text.includes("shipping")
    ) {
        return `🚚 আমরা সারা বাংলাদেশে ডেলিভারি করে থাকি।`;
    }

    // Payment
    if (
        text.includes("payment") ||
        text.includes("cod") ||
        text.includes("cash on delivery")
    ) {
        return `💵 Cash on Delivery Available।`;
    }

    // Human Support
    if (
        text.includes("agent") ||
        text.includes("support") ||
        text.includes("admin") ||
        text.includes("human") ||
        text.includes("customer care") ||
        text.includes("মানুষ") ||
        text.includes("কথা বলতে চাই") ||
        text.includes("হেল্প") ||
        text.includes("সাপোর্ট")
    ) {
        return `📞 আমাদের সাপোর্ট টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।

আপনার প্রয়োজন বিস্তারিত লিখে পাঠান। আমরা যত দ্রুত সম্ভব সাহায্য করবো। ❤️`;
    }

    // Exchange
    if (
        text.includes("exchange") ||
        text.includes("return")
    ) {
        return `🔄 পণ্যে কোনো সমস্যা থাকলে আমাদের সাথে যোগাযোগ করুন।`;
    }

    return null;
}
async function getAIResponse(userMessage) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are the customer support assistant of Flame Street Wear.

Rules:

- Always reply in Bangla.
- Keep answers short and helpful.
- Flame Street Wear sells premium streetwear and drop shoulder t-shirts.
- If someone wants to order, direct them to https://flame-bd.com
- If someone asks about size, ask for height and weight.
- If you don't know something, say you are not sure and ask them to contact support.
- Never make up policies.
- Be friendly and professional.

Available product colors:
- Black
- White
- Bottle Green
- Maroon

Never claim that other colors are available.

If a customer asks for unavailable colors, politely tell them that only Black, White, Bottle Green, and Maroon are currently available.
`,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            max_tokens: 150,
        });

        return (
            response.choices?.[0]?.message?.content ||
            "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।"
        );
    } catch (error) {
        console.error(
            "OpenAI Error:",
            error.response?.data || error.message
        );

        return "দুঃখিত, এই মুহূর্তে AI সহকারী সাময়িকভাবে উপলব্ধ নয়।";
    }
}

async function getProductRecommendation(userMessage) {
    try {

        const response = await axios.get(
            "https://al-arafatfoundation-server-production.up.railway.app/products"
        );

        const products = response.data;

        const text = userMessage.toLowerCase();

        // Exact Color Detection
        let matchedColor = null;

        if (
            text.includes("black") ||
            text.includes("কালো") ||
            text.includes("kalo")
        ) {
            matchedColor = "black";
        }

        else if (
            text.includes("white") ||
            text.includes("সাদা") ||
            text.includes("shada")
        ) {
            matchedColor = "white";
        }

        else if (
            text.includes("green") ||
            text.includes("সবুজ") ||
            text.includes("bottle green")
        ) {
            matchedColor = "bottle green";
        }

        else if (
            text.includes("maroon") ||
            text.includes("মেরুন")
        ) {
            matchedColor = "maroon";
        }

        // Supported color mention না থাকলে
        if (!matchedColor) {
            return null;
        }

        const matchedProducts = products.filter((product) => {

            const color =
                product.variation.color.toLowerCase();

            return color === matchedColor;
        });

        if (matchedProducts.length === 0) {
            return null;
        }

        const topProducts = matchedProducts.slice(0, 3);

        let reply =
            "🔥 আমাদের কিছু পছন্দের প্রোডাক্ট:\n\n";

        topProducts.forEach((product) => {

            reply += `🛒 ${product.basicInfo.productName}\n`;
            reply += `💰 Price: ${product.pricingInventory.discountPrice}\n`;
            reply += `🎨 Color: ${product.variation.color}\n\n`;

        });

        reply += "🌐 Order: https://flame-bd.com";

        return reply;

    } catch (error) {

        console.error(
            "Product Recommendation Error:",
            error.message
        );

        return null;
    }
}

async function getOrderTracking(orderId) {
    try {

        console.log("Tracking Order ID:", orderId);

        const response = await axios.get(
            `https://al-arafatfoundation-server-production.up.railway.app/orders/${orderId}`
        );

        console.log("Order Response:", response.data);

        const order = response.data;

        return `📦 Order Status: ${order.orderStatus}`;

    } catch (error) {

        console.log(
            "Order Tracking Error:",
            error.response?.data || error.message
        );

        return null;
    }
}

app.post("/webhook", async (req, res) => {
    try {
        const body = req.body;

        if (body.object === "page") {
            for (const entry of body.entry) {
                for (const webhookEvent of entry.messaging) {
                    const senderId = webhookEvent.sender.id;

                    if (webhookEvent.message?.text) {
                        const userMessage = webhookEvent.message.text;

                        const orderIdRegex = /^[a-f0-9]{24}$/i;

                        if (orderIdRegex.test(userMessage)) {

                            const trackingResponse =
                                await getOrderTracking(userMessage);

                            if (trackingResponse) {

                                await axios.post(
                                    `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                                    {
                                        recipient: {
                                            id: senderId,
                                        },
                                        message: {
                                            text: trackingResponse,
                                        },
                                    }
                                );

                                console.log("Order Status Sent");

                                continue;
                            }
                        }

                        const faqResponse = getFAQResponse(userMessage);

                        let replyText;

                        if (faqResponse) {

                            replyText = faqResponse;

                        } else {

                            const productReply =
                                await getProductRecommendation(userMessage);

                            if (productReply) {

                                console.log("Product Recommendation Found");

                                replyText = productReply;

                            } else {

                                console.log("Using OpenAI");

                                replyText =
                                    await getAIResponse(userMessage);
                            }
                        }

                        await axios.post(
                            `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                            {
                                recipient: {
                                    id: senderId,
                                },
                                message: {
                                    text: replyText,
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