import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import newRequest from "../../utils/newRequest";
import { useStateValue } from '../store/StateProvider';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%"
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

function EducationalDiploma({ prevStep, nextStep }) {
  const classes = useStyles();
  const { id } = useParams();
  const history = useNavigate();
  const [{ }, dispatch] = useStateValue();
  const [educationalState, setEducationalState] = useState([
    {
      diplomName: "",
      diplomUrl:"",
      universityName: "",
      yearGraduation: "",
      diplomcountry: "",
      speciality: "",
    },
  ]);
  const [showAlert, setShowAlert] = useState(false); // État pour afficher ou masquer l'alerte

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const addUserQualification = async () => {
    // Vérifier si tous les champs sont remplis
    const hasEmptyField = educationalState.some(
      (edu) =>
        edu.diplomName === "" ||
        edu.universityName === "" ||
        edu.yearGraduation === "" ||
        edu.diplomcountry === "" ||
        edu.speciality === ""
    );

    if (hasEmptyField) {
      // Afficher l'alerte si un champ est vide
      setShowAlert(true);
      return;
    }

    try {
      const updatedEducationalState = educationalState.map(edu => ({
        userId: currentUser._id,
        diplomName: edu.diplomName,
        universityName: edu.universityName,
        yearGraduation: edu.yearGraduation,
        diplomcountry: edu.diplomcountry,
        diplomUrl: edu.diplomUrl,
        speciality: edu.speciality,
      }));
        // Envoyer les données au serveur
        if (id) {
          // Si l'ID est présent, cela signifie que l'utilisateur souhaite mettre à jour ses informations
          await newRequest.put(`/eductionaldiploma/${id}`, {educations: updatedEducationalState});
          history(`/profil/${id}`); // Correction de la redirection
        } else {
          // Sinon, l'utilisateur ajoute de nouvelles informations
          const response = await newRequest.post("/eductionaldiploma", { educations: updatedEducationalState,  });
          nextStep();
        } 
      dispatch({
        type: "ADD_USER_QUALIFICATION",
        payload: updatedEducationalState,
      });

      // Mettez à jour le local storage avec les qualifications
      localStorage.setItem("educational", JSON.stringify(updatedEducationalState));

    } catch (error) {
      console.error("Erreur lors de l'ajout d'éducationnal diploma:", error);
    }
  };

  const educationalHandleChange = (e, index) => {
    const { name, value } = e.target;
    const values = [...educationalState];
    values[index][name] = value;
    setEducationalState(values);
  };

  const handleAddForm = () => {
    setEducationalState(prevState => ([
      ...prevState,
      {
        diplomName: "",
        universityName: "",
        yearGraduation: "",
        diplomcountry: "",
        diplomUrl: "",
        speciality: "",
      },
    ]));
  };

  const handleRemoveForm = (index) => {
    const values = [...educationalState];
    values.splice(index, 1);
    setEducationalState(values);
    dispatch({
      type: "REMOVE_USER_QUALIFICATION",
      payload: values,
    });
  };

  useEffect(() => {
    const educationalLocal = JSON.parse(localStorage.getItem("educational"));

    if (Array.isArray(educationalLocal) && educationalLocal.length > 0) {
      setEducationalState(educationalLocal);
    } else {
      setEducationalState([
        {
          userId: currentUser._id,
          diplomName: "",
          universityName: "",
          yearGraduation: "",
          diplomcountry: "",
          diplomUrl:"",
          speciality:"",
        },
      ]);
    }
  }, []);

    return (
        <Container component="main" maxWidth="xs">
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
                        <CastForEducationIcon />
                    </Avatar>
                    Diplôme d'études
                </Typography>
                
                {Array.isArray(educationalState) && educationalState.map((value, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <Accordion >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                  
                                        <Typography className="">Ajouter Qualification</Typography> 
                                      
                                    
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Nom du diplôme" autoFocus variant="outlined" value={value.diplomName} name="diplomName" onChange={e => educationalHandleChange(e, index)} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Spécialité" autoFocus variant="outlined" value={value.speciality} name="speciality" onChange={e => educationalHandleChange(e, index)} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Nom de l’université" variant="outlined" value={value.universityName} name="universityName" onChange={e => educationalHandleChange(e, index)} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Url De Diplome" variant="outlined" value={value.diplomUrl} name="diplomUrl" onChange={e => educationalHandleChange(e, index)} fullWidth required />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField label="Année d'obtention :" variant="outlined" value={value.yearGraduation} name="yearGraduation" onChange={e => educationalHandleChange(e, index)} required />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField label="Pays" variant="outlined" value={value.diplomcountry} name="diplomcountry" onChange={e => educationalHandleChange(e, index)} fullWidth required />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                            <Divider />
                            <AccordionActions>
                                <Button size="small" color="primary" onClick={() => handleRemoveForm(index)}>
                                    Supprimer
                                </Button>
                            </AccordionActions>
                        </Accordion>
                    </div>
                ))}
            </div>
            <div className={classes.btnFloat}>
            {!id && (  <Button
                    variant="contained"
                    color="primary"
                    onClick={prevStep}
                >
                    Retour
                </Button>)}
                <Fab size="small" aria-label="add" onClick={handleAddForm}>
                    <AddIcon />
                </Fab>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={addUserQualification}
                >
                   {id ? <Link className="link" to={`/Profil/${currentUser._id}`} >Modifier</Link>: " Suivant"}
                </Button>
            </div>
        </Container>
    );
}

export default EducationalDiploma;
