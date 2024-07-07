import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert"; 
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import Avatar from "@material-ui/core/Avatar";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useStateValue } from "../store/StateProvider";
import newRequest from "../../utils/newRequest";

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
   
  },
}));

const ProjectForm = ({ nextStep, prevStep }) => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { id } = useParams();
  const classes = useStyles();
  const [, dispatch] = useStateValue();
  const [project_state, setProject_state] = useState([
    {
      userId: currentUser._id,
      projectName: "",
      projectUrl: "",
      project_description: "",
    },
  ]);
  const [showAlert, setShowAlert] = useState(false); // Variable d'état pour afficher l'alerte de validation

  const handle_ProjectState_Change = (e, index) => {
    const { name, value } = e.target;
  
    const updatedProjects = [...project_state];
    updatedProjects[index][name] = value;
    setProject_state(updatedProjects);
  };
  
  const handleAddForm = () => {
    setProject_state([
      ...project_state,
      {
        userId: currentUser._id,
        projectName: "",
        projectUrl: "",
        project_description: "",
      },
    ]);
  };

  const addUserProject = async () => {
    // Vérifier si tous les champs obligatoires sont remplis
    const hasEmptyField = project_state.some(
      (project) =>
        project.projectName === "" ||
        project.projectUrl === "" ||
        project.project_description === ""
    );

    if (hasEmptyField) {
      // Afficher l'alerte si un champ est vide
      setShowAlert(true);
      return;
    }

    try {
      const updatedProjects = project_state.map(project => ({
        userId: currentUser._id,
        projectName: project.projectName,
        projectUrl: project.projectUrl,
        project_description: project.project_description,
      }));
      console.log(updatedProjects);  // Utilisez updatedProjects au lieu de updateProjects
  
      const response = await newRequest.post("/projects", {
        projects: updatedProjects,
      });
  
      dispatch({
        type: "ADD_USER_PROJECT",
        payload: project_state,
      });
  
      nextStep();
    } catch (error) {
      console.error("Erreur lors de l'ajout des projets :", error);
    }
  };
  
  
  const handleRemoveForm = (index) => {
    const updatedProjects = [...project_state];
    updatedProjects.splice(index, 1);
    setProject_state(updatedProjects);

    dispatch({
      type: "ADD_USER_PROJECT",
      payload: updatedProjects,
    });
  };

  useEffect(() => {
    const project_local = JSON.parse(localStorage.getItem("project"));
  
    if (Array.isArray(project_local) && project_local.length > 0) {
      setProject_state(project_local);
    } else {
      setProject_state([
        {
          userId: currentUser._id,
          projectName: "",
          projectUrl: "",
          project_description: "",
        },
      ]);
    }
  }, []);
  
 
  return (
    <Container component="main" maxWidth="xs" >
      <div className={classes.paper}>
        {showAlert && (
          <Alert severity="error" className={classes.alert}>Tous les champs sont obligatoires.</Alert>
        )}
        <Typography
          className={classes.logo}
          align="center"
          component="h1"
          variant="h5"
          gutterBottom
        >
          <Avatar className={classes.avatar}>
            <DeveloperModeIcon />
          </Avatar>
          Projets
        </Typography>

        {project_state.map((value, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                {value.projectName ? (
                  <Typography className="">{value.projectName}</Typography>
                ) : (
                  "Nom du projet"
                )}
              </AccordionSummary>
                    <AccordionDetails>
                        
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Nom du projet"
                      variant="outlined"
                      value={value.projectName}
                      name="projectName"
                      onChange={(e) => handle_ProjectState_Change(e, index)}
                      fullWidth
                      required // Ajoutez la propriété required pour valider le champ obligatoire
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Description du projet"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={value.project_description}
                      name="project_description"
                      onChange={(e) => handle_ProjectState_Change(e, index)}
                      fullWidth
                      required // Ajoutez la propriété required pour valider le champ obligatoire
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="URL du projet"
                      variant="outlined"
                      value={value.projectUrl}
                      name="projectUrl"
                      onChange={(e) => handle_ProjectState_Change(e, index)}
                      fullWidth
                      required // Ajoutez la propriété required pour valider le champ obligatoire
                    />
                  </Grid>
              
              </Grid>
              </AccordionDetails>

              <Divider />
              <AccordionActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={(e) => handleRemoveForm(index)}
                >
                  Supprimer
                </Button>
              </AccordionActions>
            </Accordion>
          </div>
        ))}
      </div>
      <div className={classes.btnFloat}>
      {!id && ( <Button variant="contained" color="primary" onClick={prevStep}>
          Retour
        </Button>)}
              <Fab size="small"  aria-label="add" onClick={handleAddForm}>
          <AddIcon />
        </Fab>

        <Button
    
          variant="contained"
          color="secondary"
          onClick={addUserProject}
        >
             {id ? <Link className="link" to={`/Profil/${currentUser._id}`} >Modifier</Link>: " Suivant"}
        </Button>
       
      </div>
    </Container>
  );
}

export default ProjectForm;
