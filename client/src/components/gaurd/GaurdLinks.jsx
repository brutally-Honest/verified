import { Link } from "react-router-dom";
import { TodaysVisitors } from "./TodaysVisitors";
import { ExpectedVisitorsGaurd } from "./ExpectedVisitorsGaurd";
export const GaurdLinks = () => {
  return (
    <>
      <Link to="/visitors/new">
        <div className="flex justify-center items-center mt-3 cursor-pointer rounded-lg shadow w-[180px] h-[100px]">
          New Visitor
        </div>
      </Link>

      <div className="flex flex-col m-2 my-4">
        <div className="flex justify-center text-base mx-5 rounded-lg shadow-lg min-w-[500px]">
          <ExpectedVisitorsGaurd />
        </div>
        <div className="flex justify-center text-base mx-5 rounded-lg shadow-lg min-w-[500px]">
          <TodaysVisitors />
        </div>
      </div>
    </>
  );
};
