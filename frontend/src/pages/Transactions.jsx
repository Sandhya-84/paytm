import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate=useNavigate();
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


            setTransactions(res.data.transactions);
        });
    }, []);

    return (

        <div className="m-8">
            <div className="justify-between flex item-center">
            <h1 className="text-2xl font-bold mb-4">
                Transaction History
            </h1>

           <button
    onClick={() => navigate("/dashboard")}
    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 
               text-white px-4 py-2 rounded-lg shadow-md 
               hover:from-blue-600 hover:to-blue-700 
               transition-all duration-200 active:scale-95"
>
    <FiArrowLeft className="text-lg" />
    Dashboard
</button>
            </div>



            {transactions.map(txn => (
                <div
                    key={txn._id}
                    className="border p-4 rounded mb-3 shadow-sm"
                >
                  <div className="font-semibold">
                        {txn.sender?.firstName} {txn.sender?.lastName}
                        {" → "}
                        {txn.receiver?.firstName} {txn.receiver?.lastName}
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