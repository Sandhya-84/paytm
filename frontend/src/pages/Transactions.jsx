import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        axios.get(
            `${BACKEND_URL}/api/v1/account/transactions`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        ).then(res => {
            console.log(res.data.transactions);
console.log(res.data.transactions);

            setTransactions(res.data.transactions);
        });
    }, []);

    return (
        <div className="m-8">
            <h1 className="text-2xl font-bold mb-4">
                Transaction History
            </h1>

            {transactions.map(txn => (
                <div
                    key={txn._id}
                    className="border p-4 rounded mb-3 shadow-sm"
                >
                   <div className="font-semibold">
    {txn.senderFirstName} {txn.senderLastName}
    {" → "}
    {txn.receiverFirstName} {txn.receiverLastName}
</div>
                    <div className="mt-1">
                        ₹{txn.amount}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                        {new Date(txn.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
};