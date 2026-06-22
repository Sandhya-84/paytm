import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    const [search,setSearch]=useState("");
    const token = localStorage.getItem("token");
    const [VisibleCount,setVisibleCount]=useState(10);

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

            const filteredTransactions = transactions.filter((txn) => {
    const sender =
        `${txn.sender?.firstName || ""} ${txn.sender?.lastName || ""}`;

    const receiver =
        `${txn.receiver?.firstName || ""} ${txn.receiver?.lastName || ""}`;

    return (
        sender.toLowerCase().includes(search.toLowerCase()) ||
        receiver.toLowerCase().includes(search.toLowerCase())
    );
});

const isToday = (date) => {
    return (
        new Date(date).toDateString() ===
        new Date().toDateString()
    );
};

const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        new Date(date).toDateString() ===
        yesterday.toDateString()
    );
};

const todayTransactions = filteredTransactions.filter((txn) =>
    isToday(txn.createdAt)
);

const yesterdayTransactions = filteredTransactions.filter((txn) =>
    isYesterday(txn.createdAt)
);

const olderTransactions = filteredTransactions.filter(
    (txn) =>
        !isToday(txn.createdAt) &&
        !isYesterday(txn.createdAt)
);

const renderTransaction = (txn) => {
    const senderId = String(txn.sender?._id || txn.sender);
    const isSent = senderId === currentUserId;

    return (
        <div
            key={txn._id}
            className="border p-4 rounded-lg mb-3 shadow-sm flex justify-between items-center bg-white"
        >
            <div>
                <div className="font-semibold">
                    {txn.sender?.firstName || "You"} →{" "}
                    {txn.receiver?.firstName || "User"}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                    {new Date(txn.createdAt).toLocaleString()}
                </div>
            </div>

            <div className="text-right">
                <div
                    className={`font-bold ${
                        isSent
                            ? "text-red-600"
                            : "text-green-600"
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
};
    return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
                Transaction History
            </h1>

            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                <FiArrowLeft />
                Dashboard
            </button>
        </div>

        <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3 mb-6"
        />

        {todayTransactions.length > 0 && (
            <>
                <h2 className="text-xl font-bold mb-3">
                    Today
                </h2>

                {todayTransactions.map(renderTransaction)}
            </>
        )}

        {yesterdayTransactions.length > 0 && (
            <>
                <h2 className="text-xl font-bold mt-8 mb-3">
                    Yesterday
                </h2>

                {yesterdayTransactions.map(renderTransaction)}
            </>
        )}

        {olderTransactions.length > 0 && (
            <>
                <h2 className="text-xl font-bold mt-8 mb-3">
                    Older
                </h2>

                {olderTransactions
                    .slice(0, VisibleCount)
                    .map(renderTransaction)}

                {VisibleCount < olderTransactions.length && (
                    <button
                        onClick={() =>
                            setVisibleCount(
                                VisibleCount + 10
                            )
                        }
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Show More
                    </button>
                )}
            </>
        )}

        {filteredTransactions.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
                No transactions found
            </div>
        )}
    </div>
);
}