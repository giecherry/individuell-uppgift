import express from "express";
import {auth,adminAuth} from "../middleware/auth.js";
const router = express.Router();
import Order from "../models/Order.js";
import User from "../models/User.js";



// - Om en icke-admin försöker få åtkomst ska API:t svara med en **`404 Not Found`**, så att resursen inte avslöjas.


//API:t ska returnera en lista med totala orderintäkter för varje månad bakåt i tiden, från nuvarande månad till exakt ett år tillbaka.
router.get("/analytics/revenue-per-month", auth, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("totalPrice");
        const revenuePerMonth = {};
        orders.forEach(order => {
            const month = new Date(order.createdAt).toLocaleString('default', { month: 'long' });
            if (!revenuePerMonth[month]) {
                revenuePerMonth[month] = 0;
            }
            revenuePerMonth[month] += order.totalPrice;
        });
        res.status(200).json(revenuePerMonth);
        console.log("Revenue per month calculated successfully");
    } catch (error) {
        console.error("Error fetching revenue per month:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
