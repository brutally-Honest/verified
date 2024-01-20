import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import  CustomTable  from "../ui/CustomTable";
import _ from "lodash";

export const Revenue = () => {
  const groupAdmins = useSelector((state) => state.admin.users.groupAdmins);
  const allPayments = useSelector((state) => state.admin.payments);

  const columns = [
    { header: "Payer", accessor: "payer" },
    { header: "Group", accessor: "group" },
    { header: "Amount", accessor: "amount" },
    { header: "Plan", accessor: "plan" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
  ];
  const allPaymentsData = allPayments.map((e) => {
    return {
      id: e._id,
      payer: groupAdmins?.find((ele) => ele._id === e.payer)?.userAuthId
        ?.userName,
      group: groupAdmins?.find((ele) => ele.group._id === e.group)?.group
        .groupName,
      amount: e.amount,
      plan: e.plan,
      startDate: new Date(e.createdAt).toDateString(),
      endDate: new Date(e.endsAt).toDateString(),
    };
  });
  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Revenue",
        data:[allPaymentsData.map(e=>e.amount).reduce((acc,cv)=>{acc+=cv;return acc},0)]
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#31e060"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };
  return (
    <div className="h-screen">
      <div className=" flex flex-col items-center">
        <h1 className="text-center font-semibold text-2xl">
          REVENUE STATISTICS
        </h1>
        <div className="p-2 w-[50vw]">
          <Chart {...chartConfig} />
        </div>
        <div className="flex justify-center">
          {allPayments && (
            <CustomTable columns={columns} data={allPaymentsData} />
          )}
        </div>
      </div>
    </div>
  );
};
