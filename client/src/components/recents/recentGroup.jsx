import { useSelector } from "react-redux";

export const RecentGroup = () => {
  const groups = useSelector((state) => state.admin.groups);
  const latestGroup = groups[groups.length - 1];
  return (
    <div className=" flex flex-col  items-center p-1">
      <h2 className="font-light text-lg">Recent Group</h2>
      {latestGroup && (
        <div className="flex text-black rounded bg-gradient-to-l from-indigo-200 via-neutral-300 to-stone-300 p-1 shadow">
          <div className="flex flex-col font-medium text-base border-r">
            <div className="p-2 ">Name</div>
            <div className="p-2 ">Admin</div>
            <div className="p-2 ">Blocks</div>
            <div className="p-2 ">Units</div>
            <div className="p-2 ">Gaurd</div>
            <div className="p-2 ">Members</div>
          </div>
          <div className="flex flex-col uppercase font-semibold text-base">
            <div className="p-2 px-1 text-center">{latestGroup.groupName}</div>
            <div className="p-2 px-1 text-center">
              {latestGroup.groupAdmin.userAuthId.userName}
            </div>
            <div className="p-2 px-1 text-center">{latestGroup.blocks?.length}</div>
            <div className="p-2 px-1 text-center">
              {latestGroup.blocks?.reduce((acc, cv) => {
                acc += cv?.blockId.units.length;
                return acc;
              }, 0)}
            </div>
            <div className="p-2 px-1 text-center">
              {latestGroup.gaurd
                ? latestGroup.gaurd.userAuthId.userName
                : <span className="text-red-500">No Gaurd</span>}
            </div>
            <div className="p-2 px-1 text-center">{latestGroup.members.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
