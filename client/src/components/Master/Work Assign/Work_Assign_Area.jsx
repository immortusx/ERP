import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
const Work_Assign_Area = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [rowData, setRowData] = useState([]);
    const currentBranch = localStorage.getItem("currentDealerId");
    let [lastSalesperson, setLastSalesperson] = useState(null);
    const [showComponent, setShowComponent] = useState(false);
    const [villagelist, setAllVillageList] = useState([]);


    useEffect(() => {
        setLastSalesperson(null);
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
                    console.log(response.data.result, 'ddddddddddd')
                    const formattedData = response.data.result.map((user, index) => ({
                        id: index + 1,
                        rowNumber: index + 1,
                        person_name: user.salesperson,
                        category_name: user.category_name,
                        Village_name: user.village_names,
                    }));

                    setRowData(formattedData);
                }
            }

            getDspList();
        }
    }, [currentBranch, rowData]);

    const handleEditArea = async (ev) => {
        try {
            // console.log(ev.group_id, "evvvvvv");
            console.log(ev.user_id, "evvvvvv");

            const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/add-areaAssignUserById/${ev.user_id}`;
            const config = {
                headers: {
                    token: localStorage.getItem("rbacToken"),
                },
            };

            const response = await Axios.get(url, config);

            if (response.data && response.data.isSuccess) {
                console.log("response.data", response.data.result);
                console.log("ev", ev);

                const groupedData = {};

                for (const item of response.data.result) {
                    const {
                        id,
                        user_id,
                        category_id,
                        distribution_id,
                        dType,
                        first_name,
                        last_name,
                        phone_number,
                        group_id
                    } = item;

                    if (!groupedData[category_id]) {
                        groupedData[category_id] = {
                            id: id,
                            group_id: group_id,
                            userId: user_id,
                            fname: first_name,
                            lname: last_name,
                            phonenumber: phone_number,
                            distributiontype: dType,
                            categoryData: { label: item.category_name, value: category_id },
                            villageData: [{ label: item.name, value: distribution_id }],
                        };
                    } else {
                        if (
                            !groupedData[category_id].villageData.some(
                                (village) => village.value === distribution_id
                            )
                        ) {
                            groupedData[category_id].villageData.push({
                                label: item.name,
                                value: distribution_id,
                            });
                        }
                    }
                }

                console.log(Object.values(groupedData));

                navigate("/sale/area-Assign/add-AsignArea", {
                    state: { assigneAreaPerUser: Object.values(groupedData) },
                });
            } else {
                console.log(
                    "No data received from the server or the request was not successful."
                );
                setShowComponent(true);
                console.log(ev.user_id, "ev");
                // setName(ev.first_name+ " "+ev.last_name);
                setId(ev.user_id);
                // navigate("/sale/area-Assign", {
                //   state: { assigneAreaPerUserid: ev },
                // });
                // navigate("/sale/area-Assign", {
                //   state: { assigneAreaPerUser: response.data.result },
                // });
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };

    const [selectAll, setSelectAll] = useState(false);

    const handleHeaderCheckboxClick = () => {
        setSelectAll(!selectAll);
    }

    const handleChildCheckboxClick = (itemId) => {
        const updatedRowsData = rowData.map((row) => {
            if (row.id == itemId) {
                return {
                    ...row,
                    checkbox: !row.checkbox,
                };
            }
            return row;
        });
        setRowData(updatedRowsData);
    }


    const label = { inputProps: { "aria-label": "Checkbox demo" } };


    const columns = [
        {
            field: "rowNumber",
            headerName: (
                <Checkbox
                    {...label}
                    checked={selectAll}
                    onClick={handleHeaderCheckboxClick}
                />
            ),
            minWidth: 90,
            // flex: 1,
            renderCell: (params) => (
                <Checkbox
                    {...label}
                    checked={params.row.checkbox}
                    onClick={() => handleChildCheckboxClick(params.row.id)}
                />
            ),
        },
        {
            field: "person_name",
            headerAlign: "center",
            align: "center",
            headerClassName: "custom-header",
            headerName: "Sales Person Name",
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                if (params.value !== lastSalesperson) {
                    lastSalesperson = params.value;
                    return (
                        <div style={{ fontWeight: 'bold' }}>
                            {params.value}
                        </div>
                    );
                }
                return null;
            },
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
        {
            field: "menu",
            headerName: <FontAwesomeIcon icon={faEllipsisV} />,
            className: "bg-dark",
            sortable: false,
            filterable: false,
            headerAlign: "center",
            align: "center",
            disableColumnMenu: true,
            maxWidth: 50,
            // flex: 1,
            position: "sticky",
            renderCell: (params) => (
                <div className="d-flex justify-content-center dotHover">
                    <FontAwesomeIcon icon={faEllipsisV} />
                    <div className="expandDiv">
                        <button
                            onClick={() => {
                                handleEditArea(params.row);
                            }}
                            className="myActionBtn m-1"
                        >
                            <PlayCircleIcon color="secondary" />
                        </button>
                    </div>
                </div>
            ),
        },
    ];
    useEffect(() => {
        const rowsData = villagelist.map((item, index) => ({
            ...item,
            rowNumber: index + 1,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [villagelist, selectAll]);

    return (
        <div className="tableMenuHover"
        style={{ height: "85vh", width: "100%" }}>
           
            <DataGrid
                rows={rowData}
                columns={columns}
                getRowId={(params) => {
                    return params.rowNumber
                }}
                className='rounded'
                style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                    ...villagelist.initialState,
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                components={{
                    Toolbar: GridToolbar,
                    NoRowsOverlay: () => (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>There is no Users with current branch</span>
                        </div>)
                }}
                componentsProps={{
                    toolbar: {
                        position: 'right',
                        style: { fontFamily: 'Poppins', alignSelf: 'end' },
                    },
                }}
                rowSelection={false}
                autoPageSize={false}
            />

        </div>
    );
};

export default Work_Assign_Area;
