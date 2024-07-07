import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
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
import { useStateValue } from '../store/StateProvider';
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

function ProfessionalExperience({ prevStep, nextStep }) {
    const classes = useStyles();
    const [, dispatch] = useStateValue();
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [experienceState, setExperienceState] = useState([
        {
            userId: currentUser._id,
            function: "",
            employer: "",
            responsibilities: "",
            completionYear: "",
            country: "",
            city: ""
        },
    ]);
    const [showAlert, setShowAlert] = useState(false); // Variable d'état pour afficher l'alerte de validation

    const addproexperience = async () => {
        // Vérifier si tous les champs obligatoires sont remplis
        const hasEmptyField = experienceState.some(
            (experience) =>
                experience.function === "" ||
                experience.employer === "" ||
                experience.responsibilities === "" ||
                experience.completionYear === "" ||
                experience.country === "" ||
                experience.city === ""
        );

        if (hasEmptyField) {
            // Afficher l'alerte si un champ est vide
            setShowAlert(true);
            return;
        }

        try {
            const experiencesToAdd = experienceState.map(exp => ({
                userId: currentUser._id,
                function: exp.function,
                employer: exp.employer,
                responsibilities: exp.responsibilities,
                completionYear: exp.completionYear,
                country: exp.country,
                city: exp.city
            }));
    
            const response = await newRequest.post("/experiencepro", {
                Experiencepro: experiencesToAdd,
            });
    
            dispatch({
                type: "ADD_USER_QUALIFICATION",
                payload: experiencesToAdd, // Utilisez la variable experiencesToAdd ici
            });
    
            nextStep();
        } catch (error) {
            console.error("Erreur lors de l'ajout des expériences professionnelles:", error);
        }
    };

    const experienceHandleChange = (e, index) => {
        const { name, value } = e.target;
        const values = [...experienceState];
        values[index][name] = value;
        setExperienceState(values);
    };

    const handleAddForm = () => {
        setExperienceState([...experienceState,
        {
            function: "",
            employer: "",
            responsibilities: "",
            completionYear: "",
            country: "",
            city: ""
        }
        ]);
    };

    const handleRemoveForm = (index) => {
        const values = [...experienceState];
        values.splice(index, 1);
        setExperienceState(values);

        dispatch({
            type: "REMOVE_USER_QUALIFICATION",
            payload: values,
        });
    };

    useEffect(() => {
        const experienceLocal = JSON.parse(localStorage.getItem("experience"));
        if (Array.isArray(experienceLocal) && experienceLocal.length > 0) {
            setExperienceState(experienceLocal);
          } else {
            setExperienceState([
              {
                userId: currentUser._id,
                function: "",
                employer: "",
                responsibilities: "",
                completionYear: "",
                country: "",
                city: "",
              },
            ]);
          }
    }, []);
    
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
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
                    Expérience professionnelle
                </Typography>

                <Alert severity="info" className={classes.alert}>
                    Décrivez toutes vos expériences professionnelles. Vous pouvez inclure les emplois rémunérés, le bénévolat, les stages,
                    l’apprentissage, le travail indépendant et toute autre activité.
                </Alert>

                {showAlert && (
                    <Alert severity="error" className={classes.alert}>
                        Veuillez remplir tous les champs obligatoires.
                    </Alert>
                )}

                {experienceState?.map((value, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>

                                    {value?.function ?
                                        <Typography className="">{value.function}</Typography> :
                                        "Ajouter expérience professionnelle"
                                    }
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Fonction ou poste occupé(e)" autoFocus variant="outlined" value={value.function} name="function" onChange={(e) => experienceHandleChange(e, index)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Nom de l'employeur" variant="outlined" value={value.employer} name="employer" onChange={(e) => experienceHandleChange(e, index)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Principales activités et responsabilités"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            value={value.responsibilities}
                                            name="responsibilities"
                                            onChange={(e) => experienceHandleChange(e, index)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField label="Année d'achèvement" variant="outlined" value={value.completionYear} name="completionYear" onChange={(e) => experienceHandleChange(e, index)} fullWidth />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField label="Pays" variant="outlined" value={value.country} name="country" onChange={(e) => experienceHandleChange(e, index)} />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField label="Ville" variant="outlined" value={value.city} name="city" onChange={(e) => experienceHandleChange(e, index)} />
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
            {!id && ( <Button
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
                    onClick={addproexperience}
                >
                      {id ? <Link className="link" to={`/Profil/${currentUser._id}`} >Modifier</Link>: " Suivant"}
                </Button>
            </div>
        </Container>
    );
}

export default ProfessionalExperience;
