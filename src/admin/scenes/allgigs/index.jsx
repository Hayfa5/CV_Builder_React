import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import getCategoryName from "../../../utils/categoryName";
import { Delete as DeleteIcon } from '@mui/icons-material';

const MyGigs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();
  const [gigsData, setGigsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await newRequest.get(`/gigs`);
        const gigs = await Promise.all(
          res.data.map(async (gig) => {
            const categoryName = await getCategoryName(gig.category);
            return { ...gig, categoryName };
          })
        );
        setGigsData(gigs);
      } catch (error) {
        console.error("Error fetching gigs data:", error);
      }
    };

    fetchData();
  }, []);

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    {
      field: "img",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Link to={`/gig/${params.row._id}`} className="link">
          <img
            className="image"
            src={params.row.img}
            alt={params.row.username}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </Link>
      ),
      
    },
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "price", headerName: "Prix", flex: 1 },
    { field: "categoryName", headerName: "Catégorie", flex: 1 },
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
      <Header title="Liste des Offres" subtitle="Liste des Offres" />
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
        <DataGrid
          rows={gigsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default MyGigs;
