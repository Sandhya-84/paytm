export const AppBar=({firstName})=>{
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-6 font-bold pl-4 ">PayTM App</div>

        <div className="flex pt-2 mr-6">
            <div className="flex flex-col justify-center h-full mr-4 font-bold">Hello {firstName}</div>

            <div className="rounded-full  h-10 w-12 bg-slate-200 flex justify-center ">
                <div className="flex flex-col justify-center h-full text-l">{firstName?.charAt(0).toUpperCase()||"U"}</div>
            </div>

        </div>

    </div>
}