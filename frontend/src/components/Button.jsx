export function Button({label,onClick}){
    return <button onClick={onClick} type="button" className="text-white bg-black hover:bg-gray-700 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5">{label}</button>
}