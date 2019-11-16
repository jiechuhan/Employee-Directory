import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import Nav from "./Nav";
import API from "../utils/API";
import "../styles/DataArea.css";
import StaffContext from "../utils/StaffContext";

function DataArea() {
  const [staff, setStaff] = useState({
    users: [{}],
    order: "descend",
    filteredUsers: [{}],
    headings: [
      { name: "Image", width: "10%" },
      { name: "Name", width: "10%" },
      { name: "Phone", width: "20%" },
      { name: "Email", width: "20%" },
      { name: "DOB", width: "10%" }
    ]
  });

  const handleSort = heading => {

    if (staff.order === "descend") {
      setStaff({
        ...staff,
        order: "ascend",
      })
    } else {
      setStaff({
        ...staff,
        order: "descend"
      })
    }


    const compareFnc = (a, b) => {
      if (staff.order === "ascend") {
        // account for missing values
        if (a[heading] === undefined) {
          return 1;
        } else if (b[heading] === undefined) {
          return -1;
        }
        // numerically
        else if (heading === "name") {
          return a[heading].first.localeCompare(b[heading].first);
        } else {
          return a[heading] - b[heading];
        }
      } else {
        // account for missing values
        if (a[heading] === undefined) {
          return 1;
        } else if (b[heading] === undefined) {
          return -1;
        }
        // numerically
        else if (heading === "name") {
          return b[heading].first.localeCompare(a[heading].first);
        } else {
          return b[heading] - a[heading];
        }
      }
    }

    const sortedUsers = staff.filteredUsers.sort(compareFnc);
    setStaff({ ...staff, filteredUsers: sortedUsers });
  }

  const handleSearchChange = event => {
    console.log(event.target.value);
    const filter = event.target.value;
    const filteredList = staff.users.filter(item => {
      let values = Object.values(item)
        .join("")
        .toLowerCase();
      return values.indexOf(filter.toLowerCase()) !== -1;
    });
    setStaff({ ...staff, filteredUsers: filteredList });
  }

  useEffect(() => {
    API.getUsers().then(results => {
      setStaff({
        ...staff,
        users: results.data.results,
        filteredUsers: results.data.results
      });
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault()

    let start = document.getElementById("start").value.split('-').join("");
    let end = document.getElementById("end").value.split('-').join("");;

    if (start && end) {
      const filteredList = staff.users.filter(item => {
        
        let dob = item.dob.date.split("T")
        dob = dob[0].split("-").join("")

        return dob > start && dob < end;
      })

      setStaff({
        filteredUsers: filteredList,
        ...staff
      });
    }
  }

  return (
    <StaffContext.Provider value={staff}>
      <div>
        <Nav handleSearchChange={handleSearchChange} handleSubmit={handleSubmit}/>
        <div className="data-area">
          <DataTable
            handleSort={handleSort}
          />
        </div>
      </div>
    </StaffContext.Provider>
  );
}

export default DataArea;
