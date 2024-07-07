import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon } from '@mui/icons-material';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await newRequest.get(`/users/alluser`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  // Filtrer les utilisateurs pour éviter les doublons de profil
  const filteredUsers = React.useMemo(() => {
    if (!usersData) return [];
    const uniqueUsers = [];
    const userIds = new Set();
    usersData.forEach(user => {
      if (!userIds.has(user._id)) {
        userIds.add(user._id);
        uniqueUsers.push(user);
      }
    });
    return uniqueUsers;
  }, [usersData]);

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    {
      field: "img",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Link to={`/Profil/${params.row._id}`} className="link">
          <img src={params.value} alt={params.row.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </Link>
      ),
    },
    { field: "username", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "isExpert",
      headerName: "Expert",
      flex: 1,
      renderCell: (params) => params.value.toString(),
    },
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
      <Header title="Les Utilisateurs" subtitle="Liste des Utilisateurs" />
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
          "Error fetching data"
        ) : (
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        )}
      </Box>
    </Box>
  );
};

export default Contacts;
