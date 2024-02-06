import _ from "lodash";
import { useSelector } from "react-redux";
import CustomTable from "../ui/CustomTable";
import { axiosInstance } from "../../config/axios";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Revenue = () => {
  const groupAdmins = useSelector((state) => state.admin.users.groupAdmins);
  const allPayments = useSelector((state) => state.admin.payments);
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const payments = async () => {
    try {
      const { data } = await axiosInstance.get("/stats/payments");
      setChartData(data.monthlyRevenue);
      setTotalRevenue(...data.totalRevenue);
    } catch (e) {
      console.log(e.response);
    }
  };
  useEffect(() => {
    payments();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
    },
  };
  const labels=chartData?.map(e=>e._id)
  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue/month in Rupees',
        data: [...chartData.map((e) => e.monthlyRevenue)],
        backgroundColor: 'rgba(150, 45, 200, 0.5)',
      },
    ],
  };
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
      group: groupAdmins?.find((ele) => ele?.group?._id === e?.group)?.group
        ?.groupName,
      amount: e.amount,
      plan: e.plan,
      startDate: new Date(e.createdAt).toDateString(),
      endDate: new Date(e.endsAt).toDateString(),
    };
  });

  return (
    <div className="h-screen">
      <div className=" flex flex-col items-center">
        <h1 className="text-center font-semibold text-2xl">
          REVENUE STATISTICS
        </h1>
        <div className="p-2 ">
          Total Revenue -<strong>{totalRevenue.total}</strong>
        </div>
        <div className="p-2 w-[50vw]">
          <Bar options={options} data={data} />
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
