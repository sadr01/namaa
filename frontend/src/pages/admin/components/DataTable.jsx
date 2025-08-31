import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState } from 'react';

export default function DataTable({ columns, rows, colSize = 5 }) {
  const [pageSize, setPageSize] = useState(colSize);
  return (
    <Paper sx={{ height: `${(52 * pageSize) + 110}px`, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: pageSize } } }}
        pageSizeOptions={[5, 10, 15]}
        onPaginationModelChange={(model) => setPageSize(model.pageSize)}

        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #00000033",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          },
          "& .MuiDataGrid-columnHeader": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "center",
          },
        }}
      />
    </Paper>
  )
}
