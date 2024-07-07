import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import CodeIcon from '@material-ui/icons/Code';
import Divider from '@material-ui/core/Divider';
import { useStateValue } from "../store/StateProvider";
import newRequest from "../../utils/newRequest";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select from '@material-ui/core/Select';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  alert: {
    margin: "10px 0",
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btnFloat: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
    width: "100%",
  },
}));

export default function Skills__Form({ nextStep, prevStep }) {
  const classes = useStyles();
  const { id } = useParams();
  const [skill_state, setSkill_state] = useState({
    category: "",
    subcategory: [],
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await newRequest.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };
    fetchCategories();
  }, []);

  const handle_skillState_Change = (e) => {
    const { name, value } = e.target;
    setSkill_state(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === "category") {
      setSkill_state(prevState => ({
        ...prevState,
        subcategory: []
      }));
    }
  };

  const handleAddForm = () => {
    setSkill_state({
      category: "",
      subcategory: [],
    });
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await newRequest.get(`/subCategory/${categoryId}`);
      setSubCategories({ ...subCategories, [categoryId]: response.data });
    } catch (error) {
      console.error("Erreur lors de la récupération des sous-catégories :", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    fetchSubCategories(categoryId);
    handle_skillState_Change(e);
  };

  const [{}, dispatch] = useStateValue();

  const handleSubDomainChange = (e, subDomainId) => {
    const isChecked = e.target.checked;
    setSkill_state(prevState => ({
      ...prevState,
      subcategory: isChecked
        ? [...prevState.subcategory, subDomainId]
        : prevState.subcategory.filter((id) => id !== subDomainId)
    }));
  };

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await newRequest.get(`/skills/${id}`);
        if (response.data.length > 0) {
          setSkill_state(response.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };
  
    if (id) {
      fetchSkillsData();
    }
  }, [id]);
  

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const addUserSkill = async () => {
    if (!skill_state.category) {
      console.error("Veuillez sélectionner une catégorie.");
      return;
    }
    try {
      const response = await newRequest.post("/skills", {
        ...skill_state,
        userId: currentUser._id,
      });
      dispatch({
        type: "ADD_USER_SKILL",
        payload: skill_state,
      });
      history(`/Profil/${currentUser._id}`);

      console.log("Compétences enregistrées avec succès :", response);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des compétences :", error);
    }

  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography
          className={classes.logo}
          align="center"
          component="h1"
          variant="h5"
          gutterBottom
        >
          <Avatar className={classes.avatar}>
            <CodeIcon />
          </Avatar>
          Compétences
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`panel-header`}
          >
            {skill_state.category ? (
              <Typography>Ajouter compétence</Typography>
            ) : (
              "Category"
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormControl variant="outlined" fullWidth className={""}>
                  <Select
                    native
                    value={skill_state.category}
                    onChange={handleCategoryChange}
                    inputProps={{
                      name: "category",
                      id: `category`,
                    }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                {selectedCategoryId && subCategories[selectedCategoryId]?.map((subCategory) => (
                  <FormControlLabel
                    key={subCategory._id}
                    control={
                      <Checkbox
                        checked={skill_state.subcategory.includes(subCategory._id)}
                        onChange={(e) => handleSubDomainChange(e, subCategory._id)}
                        name={subCategory.subcategoryName}
                        color="primary"
                      />
                    }
                    label={subCategory.subcategoryName}
                  />
                ))}
              </Grid>
            </Grid>
          </AccordionDetails>
          <Divider />
        </Accordion>
      </div>

      <div className={classes.btnFloat}>
        {!id && (
          <Button variant="contained" color="primary" onClick={prevStep}>
            Retour
          </Button>)}
        <Fab aria-label="add" size="small" onClick={handleAddForm}>
          <AddIcon />
        </Fab>
        <Button variant="contained" color="secondary" onClick={addUserSkill} >
          {id ? <Link className="link" to={`/Profil/${currentUser._id}`} >Modifier</Link> : "Suivant"}
        </Button>
      </div>
    </Container>
  );
}
