import React, { useEffect, useState } from "react";
import Card from "../../../utilities/Card/Card";
import Sidebar from "../sidebar/Sidebar";
import { LayoutSidebar } from "react-bootstrap-icons";
import { useAuth } from "../../../utilities/authContext/AuthProvider";
import axios from "axios";
import axiosInstance from "../../../utilities/apiHandling/axiosInstance";

function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuth();
  const [stats, setStats] = useState({ present: 0, absent: 0, onLeave: 0 });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const fetchStats = async () => {
      if (role === "admin") {
        try {
          const response = await axiosInstance.get(
            `admin/attendance-stats/`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            console.log(data);
            setStats({
              present: data.present,
              absent: data.absent,
              onLeave: data.onLeave,
            });
          } else {
            console.error("Failed to fetch stats");
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };

    fetchStats();
  }, [role]);

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} />
      <button className="btn btn-outline-primary" onClick={toggleSidebar}>
        <LayoutSidebar className="h3 m-auto" />
      </button>

      <div className="container">
        <div className="row py-5 justify-content-center mx-auto gap-3">
          <div className="col mx-auto" lg>
            <Card
              class={"mx-auto"}
              title={stats.onLeave}
              text={"On Leave"}
              button={"open"}
            />
          </div>
          <div className="col mx-auto" lg>
            <Card
              title={stats.present}
              class={"mx-auto"}
              text={"Present"}
              button={"open"}
            />
          </div>
          <div className="col mx-auto" lg>
            <Card
              title={stats.absent}
              class={"mx-auto"}
              text={"Absent"}
              button={"open"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
