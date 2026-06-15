import { useSearchParams } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Send = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id=searchParams.get("id");
    const [success, setSuccess] = useState(false);
    const [amount,setAmount]=useState("");
    console.log(searchParams.get("id"));
    if (success) {
    return (
        <div className="h-screen flex justify-center items-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex justify-center items-center animate-bounce">
                    <span className="text-white text-4xl">✓</span>
                </div>

                <h1 className="text-2xl font-bold mt-4 text-green-600">
                    Transfer Successful
                </h1>

                <p className="mt-2  text-gray-600">
                    ₹{amount} sent successfully to {searchParams.get("name")}
                </p>
            </div>
        </div>
    );
}
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg w-96">
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-center">
                        Send Money
                    </h2>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl text-white">
                                {searchParams.get("name")?.[0].toUpperCase() || "A"}
                            </span>
                        </div>

                        <h3 className="text-2xl font-semibold">
                            {searchParams.get("name") || "Friend's Name"}
                        </h3>
                    </div>

                    <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="amount"
                                className="text-sm font-medium"
                            >
                                Amount (in Rs)
                            </label>

                            <input
                            onChange={(e)=>{
                                setAmount(Number(e.target.value));
                            }}
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>

                        <button onClick={async () => {
                            if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
}
    try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/account/transfer`,
            {
                to: id,
                amount: Number(amount)
            },
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );

        console.log(res.data);
        setSuccess(true);

        setTimeout(() => {
    navigate("/dashboard");
}, 2000);

    } catch (err) {
        console.log(err.response?.data);
    }
}}
                            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                        >
                            Initiate Transfer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};