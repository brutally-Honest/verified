import { Link } from "react-router-dom";
import { TodaysVisitors } from "./TodaysVisitors";
import { ExpectedVisitorsGaurd } from "./ExpectedVisitorsGaurd";
export const GaurdLinks = () => {
  return (
    <>
      {/* <Link to="/visitors/today">Day's Visitors</Link>
      <Link to="/visitors/expected">Expected Visitors</Link> */}
      <Link to="/visitors/new">
        <div className="flex justify-center items-center mt-3 cursor-pointer rounded-lg shadow w-[180px] h-[100px]">
          New Visitor
        </div>
      </Link>

      <div className="flex justify-evenly">
        <div className="flex  text-base mr-5">
          <TodaysVisitors />
        </div>
        <div className="flex  text-base ml-5">
          <ExpectedVisitorsGaurd />
        </div>
      </div>
    </>
  );
};
