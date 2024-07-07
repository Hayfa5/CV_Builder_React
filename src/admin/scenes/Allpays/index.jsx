import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon } from '@mui/icons-material';
import "./pays.scss";

const Pays = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();

  const { data: countriesData, isLoading, error } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await newRequest.get(`/countrycity/countries`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/countrycity/countries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["countries"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Nom", flex: 1 },
    {
      field: "actions",
      headerName: "Supprimer",
      flex: 0.5,
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
      <Header title="Les Pays" subtitle="Liste des Pays" />
      <Box
        m="40px 0 0 0"
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
        <Link to="/admin/ajouterCountry">
          <button className="button">Ajouter nouveau Pays</button>
        </Link>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Error fetching data"
        ) : (
          <DataGrid
            rows={countriesData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
            autoHeight
            pageSize={10} // Nombre de lignes à afficher par page
          />
        )}
      </Box>
    </Box>
  );
};

export default Pays;
