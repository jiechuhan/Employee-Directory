import React from "react";

const StaffContext = React.createContext({
    users: [{}],
    order: "descend",
    filteredUsers: [{}],
    headings: [{}],
    // handleSort: () => undefined,
    // handleSearchChange: () => undefined
});

export default StaffContext;