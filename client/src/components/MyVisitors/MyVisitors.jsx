import { Outlet, useNavigate } from "react-router-dom";
export const MyVistors = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-12 flex justify-evenly ">
        <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white">
          <button
            onClick={() => navigate("/myVisitors/past")}
            className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
          >
            Past Visitors
          </button>
        </div>
        <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white">
          <button
            onClick={() => navigate("/myVisitors/current")}
            className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
          >
            Current
          </button>
        </div>
        <div className="flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3px] text-white">
          <button
            onClick={() => navigate("/myVisitors/expected")}
            className=" p-2 flex items-center justify-center font-2xl font-semibold w-[100px] h-[100px] rounded-md shadow-md"
          >
            Expected
          </button>
        </div>
      </div>
      <Outlet/>
    </>
  );
};
