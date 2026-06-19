import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // ✅ SAFE JWT decoding (handles id / _id / userId)
    const decoded = token ? jwtDecode(token) : null;
    const currentUserId = decoded
        ? String(decoded.id || decoded._id || decoded.userId)
        : null;

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/account/transactions`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                console.log("transactions:", res.data.transactions);
                setTransactions(res.data.transactions);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="m-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Transaction History</h1>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 
                    text-white px-4 py-2 rounded-lg shadow-md 
                    hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-200 active:scale-95"
                >
                    <FiArrowLeft />
                    Dashboard
                </button>
            </div>

            {/* LIST */}
            {transactions.map((txn) => {
                // ✅ SAFE ID extraction (works for populated OR non-populated data)
                const senderId = String(txn.sender?._id || txn.sender);
                const receiverId = String(txn.receiver?._id || txn.receiver);

                const isSent = senderId === currentUserId;
                const isReceived = receiverId === currentUserId;

                return (
                    <div
                        key={txn._id}
                        className="border p-4 rounded mb-3 shadow-sm flex justify-between items-center"
                    >
                        {/* LEFT SIDE */}
                        <div>
                            <div className="font-semibold">
                                {txn.sender?.firstName || "You"} →{" "}
                                {txn.receiver?.firstName || "User"}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                                {new Date(txn.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="text-right">
                            <div
                                className={`font-bold ${
                                    isSent ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {isSent
                                    ? `- ₹${txn.amount}`
                                    : `+ ₹${txn.amount}`}
                            </div>

                            <span
                                className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                    isSent
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {isSent ? "Sent" : "Received"}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};