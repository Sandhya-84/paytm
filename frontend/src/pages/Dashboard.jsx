import {AppBar} from "../components/AppBar";
import {Balance} from "../components/Balance";
import {Users} from "../components/Users";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Dashboard=()=>{
    const navigate=useNavigate();
    const [balance , setBalance]=useState(0);
    const [firstName,setFirstName]=useState("");
    useEffect (()=>{
        axios.get(`${BACKEND_URL}/api/v1/account/balance`,
            {
                headers:{
                    Authorization :
                    "Bearer "+ localStorage.getItem("token")
                }
            }
        )

        .then(response=>{
            setBalance(response.data.balance);
        })

        .catch(err=>{
            console.log(err.response?.data);
        });
    },[]);

    return <div>
        <AppBar firstName={localStorage.getItem("firstName")}/>
        <div className="m-8">
           <div className="flex items-center justify-between mb-6">
    <Balance value={balance} />

    <button
        onClick={() => navigate("/transactions")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
        📜 Transactions
    </button>
</div>
            <Users/>
        </div>
    </div>
}