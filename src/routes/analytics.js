import express from "express";
import {auth,adminAuth} from "../middleware/auth.js";
const router = express.Router();
import Order from "../models/Order.js";


//API:t ska returnera en lista med totala orderintäkter för varje månad bakåt i tiden, från nuvarande månad till exakt ett år tillbaka.
router.get("/analytics/revenue-per-month", auth, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("totalPrice", "createdAt");
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        const currentDate = new Date();
        const revenuePerMonth = {};

        for (let i = 0; i < 13; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            revenuePerMonth[monthYear] = 0;
        }

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const monthYear = orderDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (revenuePerMonth[monthYear] !== undefined) {
                revenuePerMonth[monthYear] += order.totalPrice;
            }
        });

        res.status(200).json({message: "Total revenue for each month:", data:revenuePerMonth});;
        console.log("Revenue per month calculated successfully");
    } catch (error) {
        console.error("Error fetching revenue per month");
        res.status(500).json({ message: "Internal server error" });
    }
});

//Returnerar en lista över de 5 kunder som har spenderat mest totalt i webbshopen.
router.get("/analytics/top-costumers", auth, adminAuth, async (req, res) => {
    try{
        const orders = await Order.find().populate("user", "username _id");

        if (!orders || orders.length === 0) {
            console.log("No orders found therefore no top customers");
            return res.status(404).json({ message: "No orders found" });
        }

        const userTotalSpent = {};

        orders.forEach(order => {
            const userId = order.user._id.toString(); 
            const username = order.user.username; 

            if (!userTotalSpent[userId]) {
                userTotalSpent[userId] = { userId, username, totalSpent: 0 };
            }

            userTotalSpent[userId].totalSpent += order.totalPrice; 
        });

        const topCustomers = Object.values(userTotalSpent).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        console.log("Top 5 customers calculated successfully");
        res.status(200).json({message: "Top 5 customers that have spent the most", data: topCustomers});
    } catch (error) {
        console.error("Error fetching top customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
