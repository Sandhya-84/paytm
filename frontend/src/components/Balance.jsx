export function Balance({value}){
    return(
        <div className="font-bold text-lg">
            Your Balance ₹{Number(value).toFixed(2)}
        </div>
    );
}