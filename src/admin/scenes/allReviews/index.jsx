import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { Delete as DeleteIcon } from '@mui/icons-material';

const Reviews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await newRequest.get("/reviews");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "gigId", headerName: "ID Offre", flex: 1 },
    { field: "userId", headerName: "ID Utilisateur", flex: 1 },
    { field: "desc", headerName: "Description", flex: 1 },
    { field: "star", headerName: "Étoiles", flex: 1 },
    {
      field: "actions",
      headerName: "Supprimer",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <DeleteIcon
            style={{ cursor: 'pointer' }}
            onClick={() => handleDelete(params.row._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Les Critiques" subtitle="Liste des Critiques" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {isLoading ? (
          "Loading..."
        ) : error ? (
          <div>
            <p>Error fetching data</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        ) : (
          <DataGrid
            rows={reviewsData} 
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        )}
      </Box>
    </Box>
  );
};

export default Reviews;
