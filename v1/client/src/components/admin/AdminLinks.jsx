import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners";
import { RecentGroup } from "../recents/recentGroup";
import { RecentPayment } from "../recents/recentPayment";
import { RecentMember } from "../recents/recentMember";
export const AdminLinks = () => {
  const navigate=useNavigate()
  const users = useSelector((state) => state.admin.users);
  const revenue = useSelector((state) => state.admin.payments);
  const groups = useSelector((state) => state.admin.groups);
  const totalUsers = users.groupAdmins?.length + users.members?.length;
  const totalRevenue = revenue.reduce((acc, cv) => {
    acc += cv.amount;
    return acc;
  }, 0);
  const totalGroups = groups.length;

  return (
    <>
      {totalUsers && totalRevenue && totalGroups ? (
        <div className="w-[70vw] flex flex-col">
          <div className="flex justify-evenly m-3">
            <div onClick={()=>navigate('/groups/all')} className=" cursor-pointer w-[200px] h-[100px] rounded dark:bg-gradient-to-tr from-slate-800 via-violet-700 to-cyan-900 bg-white shadow-md flex flex-col items-center justify-center">
              <div className="text-sky-500 ">Groups</div>
              <div className="text-2xl">{totalGroups}</div>
            </div>
            <div onClick={()=>navigate('/users/all')} className="cursor-pointer w-[200px] h-[100px] rounded dark:bg-gradient-to-tr from-slate-800 via-violet-700 to-cyan-900 bg-white shadow-md flex flex-col items-center justify-center">
              <div className="text-sky-500 ">Users</div>
              <div className="text-2xl">{totalUsers}</div>
            </div>
            <div onClick={()=>navigate('/revenue')} className="cursor-pointer w-[200px] h-[100px] rounded dark:bg-gradient-to-tr from-slate-800 via-violet-700 to-cyan-900 bg-white shadow-md flex flex-col items-center justify-center">
              <div className="text-sky-500 ">Total Revenue</div>
              <div className="text-2xl">{totalRevenue}</div>
            </div>
          </div>
          <div className=" flex justify-evenly m-3">
            <RecentGroup />
            <RecentMember />
            <RecentPayment />
          </div>
        </div>
      ) : (
        <div className="flex justify-center m-3 h-full">
          <BarLoader height={5} width={"200px"} speedMultiplier={1.5} />
        </div>
      )}
    </>
  );
};
