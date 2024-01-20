import { useSelector } from "react-redux";

export const RecentPayment = () => {
  const payments = useSelector((state) => state.admin.payments);
  const groups=useSelector((state) => state.admin.groups)
  const latestPayemnt = payments[payments.length - 1];

  return (
    <div className=" flex flex-col  items-center p-1">
      <h2 className="font-light text-lg">Recent Payment</h2>
      {latestPayemnt && (
        <div className="flex text-black rounded bg-gradient-to-l from-indigo-200 via-neutral-300 to-stone-300 p-1 shadow">
          <div className="flex flex-col border-r">
            <div className="p-1 text-base ">Group</div>
            <div className="p-1 text-base ">Amount</div>
          </div>
          <div className="flex flex-col uppercase roboto-slab font-extrabold text-base">
            <div className="p-1 px-1 text-center">
              {groups.find(e=>e._id===latestPayemnt.group).groupName}
            </div>
            <div className="p-1 px-1 text-center text-green-500">
              {latestPayemnt.amount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
