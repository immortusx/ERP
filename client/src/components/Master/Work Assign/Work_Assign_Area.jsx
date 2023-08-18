import React, { useEffect, useState } from "react";
import Axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'

const Work_Assign_Area = () => {
    const [rowData, setRowData] = useState([]);
    const currentBranch = localStorage.getItem("currentDealerId");
    let [lastSalesperson, setLastSalesperson] = useState(null);
    const [villagelist, setAllVillageList] = useState([]);

   
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
                    console.log(response.data.result,'ddddddddddd')
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
    }, [currentBranch]);

    const[selectAll,setSelectAll]=useState(false);
    
    const handleHeaderCheckboxClick=()=>{
        setSelectAll(!selectAll);
    }
  
    const handleChildCheckboxClick=(itemId)=>{
        const updatedRowsData=rowData.map((row)=>{
            if(row.id==itemId){
                return{
                    ...row,
                    checkbox:!row.checkbox,
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
    ];
    useEffect(() => {
        const rowsData = villagelist.map((item, index) => ({
          ...item,
          rowNumber: index + 1,
          checkbox: selectAll,
        }));
        setRowData(rowsData);
      }, [villagelist,selectAll]);

    return (
        <div>
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
