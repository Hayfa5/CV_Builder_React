import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import React, { useState, useEffect } from 'react';
import newRequest from "../../../utils/newRequest";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import LocationCityOutlined from "@mui/icons-material/LocationCityOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import SubdirectoryArrowRightOutlined from "@mui/icons-material/SubdirectoryArrowRightOutlined";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gigsData, setGigsData] = useState([]);
  const [expertsData, setExpertsData] = useState([]);
  const [demandeursData, setDemandeursData] = useState([]);
  const [paysData, setPaysData] = useState([]);
  const [villesData, setVillesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [gigsAddedToday, setGigsAddedToday] = useState(0);
  const [expertsAddedToday, setExpertsAddedToday] = useState(0);
  const [demandeursAddedToday, setDemandeursAddedToday] = useState(0);
  const [reviewsAddedToday, setReviewsAddedToday] = useState(0);
  const [paysAddedToday, setPaysAddedToday] = useState(0);
  const [villesAddedToday, setVillesAddedToday] = useState(0);
  const [categoryAddedToday, setCategoryAddedToday] = useState(0);
  const [subcategoryAddedToday, setSubcategoryAddedToday] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      try {
        const res = await newRequest.get(`/gigs`);
        setGigsData(res.data);
        if (Array.isArray(res.data)) {
          const gigsToday = res.data.filter(gig => gig.createdAt?.includes(today));
          setGigsAddedToday(gigsToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching gigs data:", error);
      }

      try {
        const res = await newRequest.get(`/users/getExperts/expert`);
        setExpertsData(res.data);
        if (Array.isArray(res.data)) {
          const expertsToday = res.data.filter(expert => expert.createdAt?.includes(today));
          setExpertsAddedToday(expertsToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching experts data:", error); 
      }

      try {
        const res = await newRequest.get("/reviews");
        setReviewsData(res.data);
        if (Array.isArray(res.data)) {
          const reviewsToday = res.data.filter(review => review.createdAt?.includes(today));
          setReviewsAddedToday(reviewsToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching reviews data:", error);
      }

      try {
        const res = await newRequest.get("/users/getDemandeurs/demandeurs");
        setDemandeursData(res.data);
        if (Array.isArray(res.data)) {
          const demandeursToday = res.data.filter(demandeur => demandeur.createdAt?.includes(today));
          setDemandeursAddedToday(demandeursToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching demandeurs data:", error);
      }

      try {
        const res = await newRequest.get(`/category`);
        setCategoryData(res.data);
        if (Array.isArray(res.data)) {
          const categoryToday = res.data.filter(category => category.createdAt?.includes(today));
          setCategoryAddedToday(categoryToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }

      try {
        const res = await newRequest.get(`/subCategory`);
        setSubcategoryData(res.data);
        if (Array.isArray(res.data)) {
          const subCategoryToday = res.data.filter(subCategory => subCategory.createdAt?.includes(today));
          setSubcategoryAddedToday(subCategoryToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching subCategory data:", error);
      }

      try {
        const res = await newRequest.get(`/countrycity/countries`);
        setPaysData(res.data);
        if (Array.isArray(res.data)) {
          const countriesToday = res.data.filter(country => country.createdAt?.includes(today));
          setPaysAddedToday(countriesToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching countries data:", error);
      }

      try {
        const res = await newRequest.get(`/countrycity/cities`);
        setVillesData(res.data);
        if (Array.isArray(res.data)) {
          const citiesToday = res.data.filter(city => city.createdAt?.includes(today));
          setVillesAddedToday(citiesToday.length);
        } else {
          console.error('Les données reçues ne sont pas un tableau :', res.data);
        }
      } catch (error) {
        console.error("Error fetching cities data:", error);
      }
    };

    fetchData();
  }, []);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenu Dans Votre Dashboard" /> 
      </Box>

      {/* GRID & CHARTS */}<br/>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={expertsData.length}
            subtitle="Les Experts"
            progress="0.75"
            increase={`+${expertsAddedToday}`}
            icon={
              <GroupIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={demandeursData.length}
            subtitle="Le Demandeurs de services"
            progress="0.50"
            increase={`+${demandeursAddedToday}`}
            icon={
              <GroupIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
            <StatBox
            title={gigsData.length}
            subtitle="Les Offres"
            increase={`+${gigsAddedToday}`}
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={reviewsData.length}
            subtitle="Les Commentaires"
            progress="0.80"
            increase={`+${reviewsAddedToday}`}
            icon={
              <CommentOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={paysData.length}
            subtitle="Les Pays"
            progress="0.80"
            increase={`+${paysAddedToday}`}
            icon={
              <PublicOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={villesData.length}
            subtitle="Les Villes"
            progress="0.80"
            increase={`+${villesAddedToday}`}
            icon={
              <LocationCityOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={categoryData.length}
            subtitle="Les Domaines"
            progress="0.80"
            increase={`+${categoryAddedToday}`}
            icon={
              <CategoryOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={subcategoryData.length}
            subtitle="Les Sous Domaines"
            progress="0.80"
            increase={`+${subcategoryAddedToday}`}
            icon={
              <SubdirectoryArrowRightOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
