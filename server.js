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


async function setUserState(senderId, state) {

    const database = await connectDB();

    const stateCollection =
        database.collection("messenger_state");

    await stateCollection.updateOne(
        { senderId },
        {
            $set: {
                senderId,
                state,
                updatedAt: new Date(),
            },
        },
        { upsert: true }
    );
}

async function getUserState(senderId) {

    const database = await connectDB();

    const stateCollection =
        database.collection("messenger_state");

    return await stateCollection.findOne({
        senderId,
    });
}

async function clearUserState(senderId) {

    const database = await connectDB();

    const stateCollection =
        database.collection("messenger_state");

    await stateCollection.deleteOne({
        senderId,
    });
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

app.post("/product", async (req, res) => {
    try {
        const productData = req.body;
        console.log("Inserting Product:", productData);

        const database = await connectDB();

        // কমেন্ট তুলে দেওয়া হলো যেন ডেটাবেজে ডেটা ইনসার্ট হয়
        const productsCollection = database.collection("products");
        const result = await productsCollection.insertOne(productData);

        res.status(201).send({
            message: "Product created successfully",
            id: result.insertedId, // এখানে 'id' পাঠানো হলো যাতে ফ্রন্টএন্ডের 'data?.id' কন্ডিশন মেলে
            product: productData,
        });
    } catch (error) {
        console.error("Backend Error:", error);

        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});

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

app.delete("/product/:id", async (req, res) => {
    try {
        const productID = req.params.id;

        // ObjectId ভ্যালিড কিনা চেক করা
        if (!ObjectId.isValid(productID)) {
            return res.status(400).send({
                message: "Invalid Product ID format",
            });
        }

        const database = await connectDB();
        const productsCollection = database.collection("products");

        const result = await productsCollection.deleteOne({
            _id: new ObjectId(productID),
        });

        if (!result.deletedCount) {
            return res.status(404).send({
                message: "Product not found",
            });
        }

        res.send({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);
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


// get single order by phone number
app.get("/orders/phone/:phone", async (req, res) => {
    try {

        const phone = req.params.phone;

        const database = await connectDB();

        const orderCollection =
            database.collection("order");

        const result = await orderCollection
            .find({
                "shipping_address.phone": phone,
            })
            .sort({ _id: -1 })
            .limit(5)
            .toArray();

        if (!result.length) {
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


app.get(
    "/human-support",
    async (req, res) => {

        try {

            const database =
                await connectDB();

            const supportCollection =
                database.collection(
                    "human_support"
                );

            const result =
                await supportCollection
                    .find()
                    .sort({
                        createdAt: -1
                    })
                    .toArray();

            res.send(result);

        } catch (error) {

            console.log(error);

            res.status(500).send({
                message:
                    "Internal Server Error"
            });
        }
    }
);


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
    const text = (message || "").toLowerCase();

    // Order Tracking
    if (
        text.includes("track") ||
        text.includes("tracking") ||
        text.includes("order status") ||
        text.includes("status") ||
        text.includes("অর্ডার ট্র্যাক") ||
        text.includes("অর্ডার স্ট্যাটাস")
    ) {
        return "📦 আপনার Order ID অথবা ফোন নম্বর পাঠান।";
    }

    // Order
    if (
        (
            text.includes("order") ||
            text.includes("অর্ডার") ||
            text.includes("কিভাবে অর্ডার") ||
            text.includes("order kivabe korbo") ||
            text.includes("order korte chai") ||
            text.includes("order korte ki ki lagbe")
        ) &&
        !text.includes("track") &&
        !text.includes("tracking") &&
        !text.includes("status") &&
        !text.includes("অর্ডার ট্র্যাক") &&
        !text.includes("অর্ডার স্ট্যাটাস")
    ) {
        return `🛒 অর্ডার করতে আমাদের ওয়েবসাইট ভিজিট করুন:

https://flame-bd.com

পছন্দের টি-শার্ট নির্বাচন করে Checkout সম্পন্ন করুন।`;
    }

    // Size
    if (
        text.includes("size") ||
        text.includes("সাইজ") ||
        text.includes("size chart") ||
        text.includes("মাপ")
    ) {
        return `📏 আপনার উচ্চতা ও ওজন লিখুন।

উদাহরণ:

5'8" 72kg

অথবা

173cm 72kg`;
    }

    // Delivery
    if (
        text.includes("delivery") ||
        text.includes("ডেলিভারি") ||
        text.includes("shipping")
    ) {
        return "🚚 আমরা সারা বাংলাদেশে ডেলিভারি করে থাকি।";
    }

    // Payment
    if (
        text.includes("payment") ||
        text.includes("cod") ||
        text.includes("cash on delivery")
    ) {
        return "💵 Cash on Delivery Available।";
    }

    // Human Support


    // Exchange / Return
    if (text.includes("exchange") || text.includes("return")) {
        return "🔄 পণ্যে কোনো সমস্যা থাকলে আমাদের সাথে যোগাযোগ করুন।";
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
You are Nobita, the official AI customer support assistant of Flame Street Wear.

ABOUT FLAME STREET WEAR

- Flame Street Wear sells premium streetwear and drop shoulder t-shirts.
- Official website: https://flame-bd.com
- Always represent Flame Street Wear professionally.

LANGUAGE RULES

- Always reply in Bangla.
- Keep responses short, helpful and natural.
- Use friendly customer support tone.
- Avoid long explanations unless asked.

IDENTITY RULES

- Your name is Nobita.
- You are the official AI assistant of Flame Street Wear.
- If someone asks your name, introduce yourself as Nobita.
- If someone asks "who are you", "তুমি কে", "আপনি কে", explain that you are Nobita, the AI assistant of Flame Street Wear.
- Never claim that your name is ChatGPT.
- Do not mention OpenAI unless directly asked.

ORDER RULES

- If a customer wants to place an order, direct them to:
  https://flame-bd.com

SIZE RULES

- If someone asks about size, ask for height and weight.
- After receiving height and weight, recommend the most suitable size.

PRODUCT COLOR RULES

Currently available colors:

- Black
- White
- Bottle Green
- Maroon

- Never claim that any other color is available.
- If someone asks for unavailable colors, politely explain that only Black, White, Bottle Green and Maroon are currently available.

TRACKING RULES

- Customers can track orders using Order ID or phone number.
- If tracking information is unavailable, politely ask them to contact support.

LOCATION RULES

- Flame Street Wear currently does not have a physical showroom.
- If a customer asks for shop location, address, showroom location, office address, or where Flame Street Wear is located, explain that there is currently no physical showroom.
- Customers can order online through https://flame-bd.com.
- If needed, share this Google Maps location:

https://maps.app.goo.gl/HTARddV5UartVXF87

Example response:

"বর্তমানে Flame Street Wear-এর কোনো ফিজিক্যাল শোরুম নেই। 😊

আপনি অনলাইনে অর্ডার করতে পারবেন:
https://flame-bd.com

লোকেশন:
https://maps.app.goo.gl/HTARddV5UartVXF87

SUPPORT RULES

- If a customer requests human support, tell them that the support team will contact them soon.
- Do not promise anything that is not confirmed.

SAFETY RULES

- Never make up policies.
- Never invent delivery times.
- Never invent stock information.
- Never invent discounts or offers.
- If you are unsure, politely say that you are not certain and ask the customer to contact support.

GREETING RULES

When users say:
- Hi
- Hello
- Hey
- Bro
- Assalamu Alaikum
- হাই
- হ্যালো

Reply naturally as Nobita, for example:

"আমি Nobita, Flame Street Wear-এর AI সহকারী। 😊
কিভাবে সাহায্য করতে পারি?"
` },
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


async function getOrderTrackingByPhone(phone) {
    try {


        const response = await axios.get(
            `https://al-arafatfoundation-server-production.up.railway.app/orders/phone/${phone}`
        );

        const orders = response.data;

        let reply =
            "📦 আপনার সাম্প্রতিক অর্ডারসমূহ:\n\n";

        orders.forEach((order, index) => {

            reply += `${index + 1}. ${order.orderStatus}\n`;
            reply += `🆔 ${order._id}\n`;
            reply += `💰 ${order.pricing.total}৳\n\n`;

        });

        return reply;


    } catch (error) {

        console.log(
            "Phone Tracking Error:",
            error.response?.data || error.message
        );

        return null;
    }


}

async function saveMessengerLog(
    senderId,
    message
) {
    try {

        const database =
            await connectDB();

        const logCollection =
            database.collection(
                "messenger_logs"
            );

        await logCollection.insertOne({
            senderId,
            message,
            createdAt: new Date(),
        });

    } catch (error) {

        console.log(
            "Messenger Log Error:",
            error.message
        );

    }
}


const userStates = {};

async function getUserState(senderId) {
    return userStates[senderId] || null;
}

async function setUserState(senderId, state) {
    userStates[senderId] = state;
}

function getSizeRecommendation(message) {

    const text = message.toLowerCase();

    // Weight detect
    const weightMatch =
        text.match(/(\d+)\s*kg/i);

    // Height detect
    const heightFeetMatch =
        text.match(/(\d+)['’](\d+)/);

    const heightCmMatch =
        text.match(/(\d+)\s*cm/i);

    if (!weightMatch) {
        return "📏 দয়া করে উচ্চতা ও ওজন লিখুন।\n\nউদাহরণ:\n5'8\" 72kg";
    }

    const weight =
        parseInt(weightMatch[1]);

    let heightCm = null;

    if (heightFeetMatch) {

        const feet =
            parseInt(heightFeetMatch[1]);

        const inch =
            parseInt(heightFeetMatch[2]);

        heightCm =
            (feet * 30.48) +
            (inch * 2.54);

    }

    if (heightCmMatch) {

        heightCm =
            parseInt(heightCmMatch[1]);

    }

    let size = "";

    if (heightCm) {

        if (
            weight <= 55 &&
            heightCm <= 170
        ) {
            size = "M";
        }

        else if (
            weight <= 70 &&
            heightCm <= 178
        ) {
            size = "L";
        }

        else if (
            weight <= 85
        ) {
            size = "XL";
        }

        else {
            size = "XXL";
        }

    } else {

        if (weight <= 55) {
            size = "M";
        }
        else if (weight <= 70) {
            size = "L";
        }
        else if (weight <= 85) {
            size = "XL";
        }
        else {
            size = "XXL";
        }

    }

    return `📏 আপনার জন্য Recommended Size: ${size}`;
}

async function saveHumanSupportRequest(
    senderId,
    message
) {

    const database =
        await connectDB();

    const supportCollection =
        database.collection(
            "human_support"
        );

    await supportCollection.insertOne({
        senderId,
        message,
        status: "Pending",
        createdAt: new Date()
    });
}


app.post("/webhook", async (req, res) => {
    try {
        const body = req.body;

        if (body.object !== "page") {
            return res.sendStatus(404);
        }

        for (const entry of body.entry || []) {
            for (const webhookEvent of entry.messaging || []) {
                const senderId = webhookEvent.sender?.id;

                if (!senderId || !webhookEvent.message?.text) continue;

                const userMessage =
                    webhookEvent.message.text.trim();

                await saveMessengerLog(
                    senderId,
                    userMessage
                );

                const userState =
                    await getUserState(senderId);

                const orderIdRegex = /^[a-f0-9]{24}$/i;
                const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;

                let replyText = null;

                // =========================
                // 1. PHONE TRACKING
                // =========================
                if (phoneRegex.test(userMessage)) {
                    const trackingResponse = await getOrderTrackingByPhone(userMessage);

                    if (trackingResponse) {
                        await axios.post(
                            `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                            {
                                recipient: { id: senderId },
                                message: { text: trackingResponse },
                            }
                        );

                        console.log("Phone Tracking Sent");
                        continue; // skip rest
                    }
                }

                // =========================
                // 2. ORDER ID TRACKING
                // =========================
                if (orderIdRegex.test(userMessage)) {
                    const trackingResponse = await getOrderTracking(userMessage);

                    if (trackingResponse) {
                        await axios.post(
                            `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                            {
                                recipient: { id: senderId },
                                message: { text: trackingResponse },
                            }
                        );

                        console.log("Order Status Sent");
                        continue; // skip rest
                    }
                }

                // =========================
                // HUMAN SUPPORT
                // =========================
                if (
                    userMessage.toLowerCase().includes("agent") ||
                    userMessage.toLowerCase().includes("support") ||
                    userMessage.toLowerCase().includes("admin") ||
                    userMessage.toLowerCase().includes("human") ||
                    userMessage.includes("মানুষ") ||
                    userMessage.includes("সাপোর্ট")
                ) {

                    await saveHumanSupportRequest(
                        senderId,
                        userMessage
                    );

                    replyText =
                        "📞 আমাদের সাপোর্ট টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।";
                }

                // =========================
                // 3. FAQ CHECK
                // =========================
                const faqResponse = getFAQResponse(userMessage);

                if (faqResponse &&
                    !replyText) {

                    if (
                        userMessage.toLowerCase().includes("size") ||
                        userMessage.toLowerCase().includes("সাইজ") ||
                        userMessage.toLowerCase().includes("মাপ")
                    ) {
                        await setUserState(
                            senderId,
                            "waiting_for_size"
                        );
                    }

                    replyText = faqResponse;
                }

                // =========================
                // 4. SIZE RECOMMENDATION
                // =========================
                if (
                    !replyText &&
                    userState === "waiting_for_size"
                ) {

                    const sizeReply =
                        getSizeRecommendation(userMessage);

                    if (sizeReply) {

                        replyText = sizeReply;

                        await setUserState(
                            senderId,
                            null
                        );
                    }
                }

                // =========================
                // 5. PRODUCT RECOMMENDATION
                // =========================
                if (!replyText) {
                    const productReply = await getProductRecommendation(userMessage);
                    if (productReply) {
                        console.log("Product Recommendation Found");
                        replyText = productReply;
                    }
                }

                // =========================
                // 6. AI FALLBACK
                // =========================
                if (!replyText) {
                    console.log("Using OpenAI");
                    replyText = await getAIResponse(userMessage);
                }

                // =========================
                // SEND RESPONSE
                // =========================
                if (replyText) {
                    await axios.post(
                        `https://graph.facebook.com/v23.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
                        {
                            recipient: { id: senderId },
                            message: { text: replyText },
                        }
                    );

                    console.log("Reply Sent Successfully");
                }
            }
        }

        return res.sendStatus(200);
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