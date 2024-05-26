import React, { useEffect, useState } from "react";
import Card from "../../../utilities/Card/Card";
import Sidebar from "../sidebar/Sidebar";
import { LayoutSidebar } from "react-bootstrap-icons";
import axiosInstance from "../../../utilities/apiHandling/axiosInstance";

function StudentDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    leaves: 0,
    present: 0,
    absent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `student/student-attendance-stats/`
        );
        const data = response.data;

        // Assuming the API response contains fields for leaves, present, and absent
        setAttendanceStats({
          leaves: data.leaves,
          present: data.present,
          absent: data.absent,
        });
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleMarkAttendance = () => {
    window.location.href = "http://127.0.0.1:8000/api/v1/home";
  };
  return (
    <>
      <Sidebar
        isOpen={isOpen}
        link1={"Schedule"}
        link2={"Link2"}
        toggle={toggleSidebar}
      />
      <button className="btn btn-outline-primary" onClick={toggleSidebar}>
        <LayoutSidebar className="h3 m-auto" />
      </button>
      <div className="container">
        <div className="row py-5 justify-content-center mx-auto gap-3">
          <div className="col mx-auto" lg>
            <Card
              class={"mx-auto"}
              title={attendanceStats.present}
              text={"Your Attendance"}
              button={"open"}
            />
          </div>
          <div className="col mx-auto" lg>
            <Card
              title={attendanceStats.leaves}
              class={"mx-auto"}
              text={"Your Schedule"}
              button={"open"}
            />
          </div>
          <div className="col mx-auto" lg>
            <Card
              title={attendanceStats.absent}
              class={"mx-auto"}
              text={"Absent"}
              button={"open"}
            />
          </div>
        </div>

        <button
          className="btn btn-primary d-flex mx-auto"
          onClick={handleMarkAttendance}
        >
          Mark Attendance
        </button>
      </div>
    </>
  );
}

export default StudentDashboard;
