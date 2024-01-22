import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const GroupDetails = () => {
  const { userState:{group} } = useContext(UserContext);
  const { role } = jwtDecode(localStorage.getItem("token"));

  return (
    <>
      <div className="flex justify-center  md:mt-16 mb-5 sm:mt-8">
        <table className="border sm:w-[300px] md:w-[400px] shadow-md border-separate boder-black">
          <thead>
            <tr className="border ">
              <th className="bg-indigo-400/40 px-3 py-2">Group Name</th>
              <td className=" text-center px-3 font-semibold text-xl py-0 mb-[2px] border-b-slate-500/10 border-2 border-t-0 border-x-0">
                {group?.groupName}
              </td>
            </tr>
            <tr className="border ">
              <th className="bg-indigo-400/40 px-3 py-2">Group Code</th>
              <td className=" text-center px-3 font-semibold text-xl py-0 mb-[2px] border-b-slate-500/10 border-2 border-t-0 border-x-0">
                {group?.groupCode}
              </td>
            </tr>
            <tr className="border">
              <th className="bg-indigo-400/40 py-2">Admin</th>
              <td className=" text-center border-b-slate-500/10 border-2 border-t-0 border-x-0">
                <span
                  className=" font-semibold "
                >
                  {group?.groupAdmin?.userAuthId.userName}
                </span>
              </td>
            </tr>
            {userState.group.status === "approved" && (
              <tr className="border">
                <th className="bg-indigo-400/40 py-2">Gaurd</th>
                <td className=" text-center border-b-slate-500/10 border-2 border-t-0 border-x-0">
                  {group.gaurd ? (
                    <span>
                      {group?.gaurd?.userAuthId.userName}
                    </span>
                  ) : (
                    <>
                      {role === "member" ? (
                        <>No Gaurd</>
                      ) : (
                        <Link to="/myGroup/gaurd/new">
                          No Gaurd! <span className="underline font-semibold">Appoint One</span>
                        </Link>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )}
            <tr className="border">
              <th className="bg-indigo-400/40 py-2">Members</th>
              <td className=" text-center border-b-slate-500/10 border-2 border-t-0 border-x-0">
                {group?.members?.filter(e=>e.memberId.status==="approved").length}
              </td>
            </tr>
            <tr>
              <th className="bg-indigo-400/40">Blocks</th>
              <td className="">
                {group?.blocks?.map((block) => (
                  <table key={block.blockId._id} className="flex flex-col ">
                    <thead className=" flex justify-center">
                      <tr>
                        <th>{block?.blockId?.blockName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {block.blockId.units?.map((ele) => (
                          <td
                            key={ele.unitId._id}
                            className=" border w-[150px] text-center  font-semibold "
                          >
                            <button
                              className="focus:bg-blue-500/50 w-full p-1 rounded-sm"
                            >
                              {ele.unitId.unitNumber}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                ))}
              </td>
            </tr>
          </thead>
        </table>
      </div>
      <Outlet />
    </>
  );
};
