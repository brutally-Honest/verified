import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "../../context/UserContext";

export const RecentMember = () => {
  const { userState } = useContext(UserContext);
  const { role } = jwtDecode(localStorage.getItem("token"));
  let members, latestMember;
  if (role === "admin") {
    members = useSelector((state) => state.admin.users.members);
    latestMember = members[members.length - 1];
  } else {
    members = userState.group.members;
    if (members) latestMember = members[members.length - 1];
  }

return (<> {latestMember?<div className=" flex flex-col  items-center p-1">
<h2 className="font-light text-lg">Recent Member</h2>
{latestMember && (
  <div className="flex text-black rounded bg-gradient-to-l from-indigo-200 via-neutral-300 to-stone-300 p-1 shadow">
    <div className="flex flex-col border-r">
      <div className="p-1 text-base ">Name</div>
      {role === "admin" && <div className="p-1 text-base ">Group</div>}
      <div className="p-1 text-base ">Status</div>
    </div>
    <div className="flex flex-col uppercase roboto-slab font-extrabold text-base">
      <div className="p-1 px-1 text-center">
        {latestMember.userAuthId.userName}
      </div>
      {role === "admin" && (
        <div className="p-1 px-1 text-center">
          {latestMember.group.groupName}
        </div>
      )}
      <div className="p-1 px-1 text-center">{latestMember.status}</div>
    </div>
  </div>
)}
</div>:<></>}
  
  </>
);
      }