
import {useEffect , useState} from "react"
import axios from "axios";

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

export const Transactions = () => {

    const [transactions,setTransactions]=useState([]);

    useEffect(()=>{
        axios.get(
            `${BACKEND_URL}/api/v1/account/transactions`,
            {
                headers:{
                    Authorization:
                    "Bearer "+localStorage.getItem("token")
                }
            }
        ).then(res=>{
            setTransactions(res.data.transactions);
        });
    },[]);
    return (
        <div className="m-8">
            <h1 className="text-2xl font-bold mb-4">
                Transaction History
            </h1>

           {transactions.map(txn => (
    <div key={txn._id}>
        {txn.senderId === userId
            ? `Sent ₹${txn.amount}`
            : `Received ₹${txn.amount}`
        }
    </div>
    ))}
    </div>

);
}