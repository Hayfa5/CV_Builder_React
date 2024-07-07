import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Alert from "@material-ui/lab/Alert"; // Importer le composant d'alerte de Material-UI

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from "@material-ui/core/AccordionActions";
import CardMembershipIcon from "@material-ui/icons/CardMembership";
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

const Certification__Form = ({ nextStep, prevStep }) => {
  const classes = useStyles();
  const { id } = useParams();
  const [{}, dispatch] = useStateValue();
  const [certificate_state, setCertificate_state] = useState([
    {
      certificateName: "",
      certificateUrl: "",
      certificateDescription: "",
      certificateOrganisationName: "",
    },
  ]);
  const [showAlert, setShowAlert] = useState(false); // État pour afficher ou masquer l'alerte

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const addUserCertification = async () => {
    // Vérifier si tous les champs sont remplis
    const hasEmptyField = certificate_state.some(
      (cert) =>
        cert.certificateName === "" ||
        cert.certificateUrl === "" ||
        cert.certificateDescription === "" ||
        cert.certificateOrganisationName === ""
    );

    if (hasEmptyField) {
      // Afficher l'alerte si un champ est vide
      setShowAlert(true);
      return;
    }

    try {
      const updatedCertifications = certificate_state.map((cert) => ({
        userId: currentUser._id,
        certificateName: cert.certificateName,
        certificateUrl: cert.certificateUrl,
        certificateDescription: cert.certificateDescription,
        certificateOrganisationName: cert.certificateOrganisationName,
      }));
      console.log(updatedCertifications); // Utilisez updatedCertifications au lieu de certificate_state

      const response = await newRequest.post("/attestation", {
        certifications: updatedCertifications,
      });

      dispatch({
        type: "ADD_USER_CERTIFICATION",
        payload: updatedCertifications,
      });
      localStorage.setItem(
        "certifications",
        JSON.stringify(updatedCertifications)
      );
      nextStep();
    } catch (error) {
      console.error("Erreur lors de l'ajout des certifications:", error);
    }
  };

  const handle_certificateState_Change = (e, index) => {
    const { name, value } = e.target;
    const values = [...certificate_state];
    values[index][name] = value;
    setCertificate_state(values);
  };

  const handleAddForm = () => {
    setCertificate_state([
      ...certificate_state,
      {
        certificateName: "",
        certificateUrl: "",
        certificateDescription: "",
        certificateOrganisationName: "",
      },
    ]);
  };

  const handleRemoveForm = (index) => {
    const values = [...certificate_state];
    values.splice(index, 1);
    setCertificate_state(values);

    dispatch({
      type: "ADD_USER_CERTIFICATION",
      payload: values,
    });
  };

  useEffect(() => {
    const certificate_local = JSON.parse(localStorage.getItem("certificate"));

    if (Array.isArray(certificate_local) && certificate_local.length > 0) {
      setCertificate_state(certificate_local);
    } else {
      setCertificate_state([
        {
          certificateName: "",
          certificateUrl: "",
          certificateDescription: "",
          certificateOrganisationName: "",
        },
      ]);
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {showAlert && (
          <Alert severity="error" className={classes.alert}>
            Tous les champs sont obligatoires.
          </Alert>
        )}
        <Typography
          className={classes.logo}
          align="center"
          component="h1"
          variant="h5"
          gutterBottom
        >
          <Avatar className={classes.avatar}>
            <CardMembershipIcon />
          </Avatar>
          Attestation
        </Typography>

        {certificate_state.map((value, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                {value.certificateName ? (
                  <Typography className="">{value.certificateName}</Typography>
                ) : (
                  "Nom de l'attestation"
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Nom de l'attestation"
                      variant="outlined"
                      value={value.certificateName}
                      name="certificateName"
                      onChange={(e) => handle_certificateState_Change(e, index)}
                      fullWidth
                      required // Ajout de l'attribut required
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Description de l'attestation"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={value.certificateDescription}
                      name="certificateDescription"
                      onChange={(e) => handle_certificateState_Change(e, index)}
                      fullWidth
                      required // Ajout de l'attribut required
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      label="Nom de L'organisme"
                      multiline
                      rows={4}
                      variant="outlined"
                      value={value.certificateOrganisationName}
                      name="certificateOrganisationName"
                      onChange={(e) => handle_certificateState_Change(e, index)}
                      fullWidth
                      required // Ajout de l'attribut required
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      label=" Url de l'attestation"
                      variant="outlined"
                      value={value.certificateUrl}
                      name="certificateUrl"
                      onChange={(e) => handle_certificateState_Change(e, index)}
                      fullWidth
                      required // Ajout de l'attribut required
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
        <Button variant="contained" color="primary" onClick={prevStep}>
          Retour
        </Button>
        <Fab aria-label="add" size="small" onClick={handleAddForm}>
          <AddIcon />
        </Fab>
        <Button variant="contained" color="secondary" onClick={addUserCertification}>
          {id ? <Link className="link" to={`/Profil/${currentUser._id}`} >Modifier</Link>: " Suivant"}
        </Button>
      </div>
    </Container>
  );
};
export default Certification__Form;
