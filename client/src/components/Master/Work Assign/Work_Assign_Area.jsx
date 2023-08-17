import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Work_Assign_Area = () => {
    const [rowData, setRowData] = useState([]);
    const currentBranch = localStorage.getItem("currentDealerId");

    useEffect(() => {
        if (currentBranch) {
            async function getDspList() {
                const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-work-assign-village-list/${currentBranch}`;
                const config = {
                    headers: {
                        token: localStorage.getItem("rbacToken"),
                    },
                };

                const response = await Axios.get(url, config);
                if (response.data && response.data.isSuccess) {
                    const formattedData = response.data.result.map((user, index) => ({
                        id: index + 1,
                        rowNumber: index + 1,
                        person_name: user.salesperson,
                        category_name: user.category_name,
                        Village_name: user.village_name,
                    }));

                    setRowData(formattedData);
                }
            }

            getDspList();
        }
    }, [currentBranch]);

    const columns = [
        {
            field: "rowNumber",
            headerClassName: "custom-header",
            headerAlign: "center",
            align: "center",
            headerName: "No",
            minWidth: 80,
            flex: 1,
        },
        {
            field: "person_name",
            headerAlign: "center",
            align: "center",
            headerClassName: "custom-header",
            headerName: "Sales Person Name",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "category_name",
            headerAlign: "left",
            align: "left",
            headerClassName: "custom-header",
            headerName: "Category Name",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "Village_name",
            headerAlign: "left",
            align: "left",
            headerClassName: "custom-header",
            headerName: "Assign Village Name",
            minWidth: 200,
            flex: 1,
        },
    ];

    return (
        <div>
            <DataGrid
                rows={rowData}
                columns={columns}
                getRowId={(params) => {
                    return params.id; // Use the index as the row ID
                }}
                className="rounded"
                style={{
                    fontFamily: "Poppins",
                    padding: 5,
                    backgroundColor: "white",
                }}
                pageSizeOptions={[5, 10, 25]}
            // ... (other DataGrid props)
            />
        </div>
    );
};

export default Work_Assign_Area;
