import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ContactsIcon from "@material-ui/icons/Contacts";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import newRequest from "../../utils/newRequest";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  form: {
    marginTop: theme.spacing(3),
  },
  btnFloat: {
    display: "flex",
    float: "right",
    margin: "20px 0",
  },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  dialog: {
    "& .MuiDialog-paper": {
      minWidth: "300px",
    },
  },
}));

function UserInfoForm({ nextStep }) {
  const classes = useStyles();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const initialState = {
   
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    sexe: "",  
    ProfilTitel: "",
    videolien: "",
    dateOfBirth: "",
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d+$/;

  const [userState, setUserState] = useState(initialState);
  const [errorMessages, setErrorMessages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await newRequest.get(`/expert/${id}`);
        if (response.data.length > 0) {
          // Si des données sont disponibles, utilisez le premier élément du tableau
          setUserState((prevState) => ({
            ...prevState,
            ...response.data[0]
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    // Vérifiez si l'ID est présent dans l'URL pour décider s'il s'agit d'une modification ou d'un ajout
    if (id) {
      fetchUserData();
    }
  }, [id]);  
  
  const handleSubmit = async () => {
    setErrorMessages([]);
  
    // Logique de validation des champs
    if (
      userState.fullName &&
      userState.mobile &&
      userState.ProfilTitel &&
      userState.email &&
      userState.address &&
      userState.videolien &&
      userState.sexe &&
      emailRegex.test(userState.email) &&
      phoneRegex.test(userState.mobile)
    ) {
      try {
        // Envoyer les données au serveur
        if (id) {
          // Si l'ID est présent, cela signifie que l'utilisateur souhaite mettre à jour ses informations
          await newRequest.put(`/expert/${id}`, userState);
          history(`/profil/${id}`); // Correction de la redirection
        } else {
          // Sinon, l'utilisateur ajoute de nouvelles informations
          await newRequest.post("/expert", { ...userState, userId: currentUser._id });
        }  
        nextStep(); // Passer à l'étape suivante après avoir soumis avec succès les informations
      } catch (error) {
        console.error("Error submitting user data:", error);
        setErrorMessages(["Une erreur s'est produite lors de l'enregistrement des informations. Veuillez réessayer plus tard."]);
        setDialogOpen(true);
      }
    } else {
      const missingFields = [];
      if (!userState.fullName) missingFields.push("Nom et prénom");
      if (!userState.mobile) missingFields.push("Numéro de téléphone");
      if (!userState.email) missingFields.push("Adresse électronique");
      if (!userState.address) missingFields.push("Adresse");
      if (!userState.ProfilTitel) missingFields.push("Titre de Profil");
      if (!userState.sexe) missingFields.push("Sexe");
      if (userState.email && !emailRegex.test(userState.email)) missingFields.push("Adresse électronique invalide");
      if (userState.mobile && !phoneRegex.test(userState.mobile)) missingFields.push("Numéro de téléphone invalide");
  
      setErrorMessages([`Veuillez remplir les champs obligatoires: ${missingFields.join(", ")}`]);
      setDialogOpen(true);
    }
  };
  
  const handleUserStateChange = (e, fieldName) => {
    const { name, value } = e.target;

    setUserState((prevState) => ({
      ...prevState,
      [fieldName || name]: value,
    }));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
            <ContactsIcon />
          </Avatar>
          Informations personnelles
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="fullName"
                name="fullName"
                variant="outlined"
                required
                fullWidth
                value={userState.fullName}
                onChange={(e) => handleUserStateChange(e, "fullName")}
                id="fullName"
                label="Nom et prénom"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="mobile"
                label="Numéro de téléphone"
                name="mobile"
                autoComplete="mobile"
                value={userState.mobile}
                onChange={(e) => handleUserStateChange(e, "mobile")}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="ProfilTitel"
                label="Titre de Profil"
                name="ProfilTitel"
                autoComplete="ProfilTitel"
                value={userState.ProfilTitel}
                onChange={(e) => handleUserStateChange(e, "ProfilTitel")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="email"
                autoComplete="email"
                label="Adresse électronique"
                id="email"
                value={userState.email}
                onChange={(e) => handleUserStateChange(e, "email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="address"
                autoComplete="address"
                label="Adresse"
                id="address"
                value={userState.address}
                onChange={(e) => handleUserStateChange(e, "address")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="videolien"
                autoComplete="Lien vidéo"
                label="Lien vidéo"
                id="videolien"
                value={userState.videolien}
                onChange={(e) => handleUserStateChange(e, "videolien")}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="sexe" shrink={false}>
                  Sexe*
                </InputLabel>
                <Select
                  native
                  value={userState.sexe}
                  onChange={(e) => handleUserStateChange(e, "sexe")}
                  inputProps={{
                    name: 'sexe',
                    id: 'sexe',
                  }}
                >
                  <option value="" disabled hidden>Choisissez le sexe</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            className={classes.btnFloat}
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
          >
            {id ? "Modifier" : "Suivant"}
          </Button>
        </form>

        {/* Boîte de dialogue pour afficher les messages d'erreur */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} className={classes.dialog}>
          <DialogTitle>Erreur</DialogTitle>
          <DialogContent>
            {errorMessages.map((errorMessage, index) => (
              <Typography key={index} color="error">
                {errorMessage}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
}

export default UserInfoForm;
