import express from "express";
import {auth,adminAuth} from "../middleware/auth.js";
const router = express.Router();
import Order from "../models/Order.js";
import User from "../models/User.js";



// - Om en icke-admin försöker få åtkomst ska API:t svara med en **`404 Not Found`**, så att resursen inte avslöjas.

//API:t ska returnera en lista med totala orderintäkter för varje månad bakåt i tiden, från nuvarande månad till exakt ett år tillbaka.
router.get("/analytics/revenue-per-month", auth, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("totalPrice", "createdAt");
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        const currentDate = new Date();
        const revenuePerMonth = {};

        for (let i = 0; i < 12; i++) {
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


export default router;
