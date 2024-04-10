export const RecentVisitor=()=>{
    
    const latestVisitor=null
    return <div className=" flex flex-col  items-center p-1">
    <h2 className="font-light text-lg">Recent Visitor</h2>
    {latestVisitor && (
      <div className="flex text-black rounded bg-gradient-to-l from-indigo-200 via-neutral-300 to-stone-300 p-1 shadow">
        <div className="flex flex-col border-r">
          <div className="p-1 text-base ">Group</div>
          <div className="p-1 text-base ">Amount</div>
        </div>
        <div className="flex flex-col">
          <div className="p-0.5 px-1 text-center">
            {groups.find(e=>e._id===latestVisitor.group).groupName}
          </div>
          <div className="p-0.5 px-1 text-center text-green-500">
            {latestVisitor.amount}
          </div>
        </div>
      </div>
    )}
  </div>

}