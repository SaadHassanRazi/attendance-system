import React from "react";
import Card from "../../../utilities/Card/Card";

function AdminDashboard() {
  return (
    <>
      <div className="container">
        <div className="row py-5 justify-content-center mx-auto gap-3">
          <div className="col mx-auto" lg>
            <Card class = {'mx-auto'} title={"500"} text={"Total Students"} button={"open"} />
          </div>
          <div className="col mx-auto" lg>
            <Card title={"500"} class = {'mx-auto'} text={"Present"} button={"open"} />
          </div>
          <div className="col mx-auto" lg>
            <Card title={"500"} class = {'mx-auto'} text={"Absent"} button={"open"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
