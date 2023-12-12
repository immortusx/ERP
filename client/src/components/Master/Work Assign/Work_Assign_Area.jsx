import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'
import AreaAssignListList from "../../AreaAssignListList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { Modal, Button } from "react-bootstrap";
import location from "../../../assets/images/location.png";
import { Tooltip } from "@mui/material";
const Work_Assign_Area = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [rowData, setRowData] = useState([]);
    const currentBranch = localStorage.getItem("currentDealerId");
    const [showComponent, setShowComponent] = useState(false);
    const [villagelist, setAllVillageList] = useState([]);
    const [workAssignData, setWOrkAssignData] = useState([]);


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
                        rowNumber: index + 1,
                        person_name: user.salesperson,
                        category_name: user.category_name,
                        Village_name: user.village_names,
                        user_id: user.user_id
                    }));

                    setWOrkAssignData(formattedData);
                }
            }

            getDspList();
        }
    }, [currentBranch]);

    const hideareamodal = () => {
        setShowComponent(false);
    };

    const handleEditArea = async (ev) => {

        try {
            const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/add-areaAssignUserById/${ev.user_id}`;
            const config = {
                headers: {
                    token: localStorage.getItem("rbacToken"),
                },
            };

            const response = await Axios.get(url, config);

            if (response.data && response.data.isSuccess) {

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

                navigate("/sale/area-Assign/add-AsignArea", {
                    state: { assigneAreaPerUser: Object.values(groupedData) },
                });
            } else {
                setShowComponent(true);
                setId(ev.user_id);
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };

    const [selectAll, setSelectAll] = useState(false);
    const handleHeaderCheckboxClick = () => {
        setSelectAll(!selectAll);
    }

    const redirectModal = () => {
        navigate(-1);
    };

    const handleChildCheckboxClick = (itemId) => {
        const updatedRowsData = rowData.map((row) => {
            if (row.rowNumber === itemId) {
                return {
                    ...row,
                    checkbox: !row.checkbox,
                };
            }
            return row;
        });
        setRowData(updatedRowsData);
    };

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
            renderCell: (params) => (
                <Checkbox
                    {...label}
                    checked={params.row.checkbox}
                    onClick={() => handleChildCheckboxClick(params.row.rowNumber)}
                />
            ),
        }, {
            field: "person_name",
            headerAlign: "center",
            align: "center",
            headerClassName: "custom-header",
            headerName: "Sales Person Name",
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {

                return (
                    <div>
                        {params.value}
                    </div>
                );

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
            flex: 1.2,
        },
        {
            field: "menu",
            headerName: (
                <FontAwesomeIcon icon={faEllipsisV} style={{ marginRight: "15px" }} />
            ),
            className: "bg-dark",
            sortable: false,
            filterable: false,
            headerAlign: "right",
            align: "right",
            disableColumnMenu: true,
            width: 130,
            // flex: 1,
            position: "sticky",
            renderCell: (params) => (
                <div className="d-flex justify-content-center dotHoverempicon ">
                    <FontAwesomeIcon icon={faEllipsisV} />
                    <div className="expandDiv">
                        <Tooltip title="Assign Area">
                            <button
                                onClick={() => {
                                    handleEditArea(params.row);
                                }}
                                className="myActionBtn m-1"
                            >
                                <img src={location} alt="Location" height={20} width={20} />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const rowsData = workAssignData.map((item, index) => ({
            ...item,
            rowNumber: index + 1,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [workAssignData, selectAll]);


    return (
        <>
            <div className="my-3  d-flex align-items-end justify-content-end">
                <Button
                    variant="btn btn-warning mx-1"
                    style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px' }}
                    onClick={() => {
                        redirectModal();
                    }}
                >
                    BACK
                </Button>

            </div>
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
                        ...workAssignData.initialState,
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
            <AreaAssignListList
                showModal={showComponent}
                hideModal={hideareamodal}
                id={id}
            />
        </>
    );
};

export default Work_Assign_Area;
