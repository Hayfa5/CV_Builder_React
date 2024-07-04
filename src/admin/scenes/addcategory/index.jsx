import React, { useReducer, useState } from "react";
import "../../AddCategorie.scss";
import newRequest from "../../../utils/newRequest";
import upload from "../../../utils/upload";
import { useNavigate } from "react-router-dom";

// Définition de l'état initial
const INITIAL_STATE = {
  title: "",
  features: [],
};

// Reducer pour gérer l'état
const AddCate = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return { ...state, [action.payload.name]: action.payload.value };
    case "ADD_FEATURE":
      return { ...state, features: [...state.features, action.payload] };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter((feature) => feature !== action.payload),
      };
    default:
      return state;
  }
};

const AddCategorie = () => {
  const [file, setFile] = useState(null);
  const [state, dispatch] = useReducer(AddCate, INITIAL_STATE);
  const navigate = useNavigate(); // Hook de navigation

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.title) {
        alert("Veuillez remplir le champ categorie.");
        return; // Arrêter l'exécution de la fonction si le champ est vide
    }

    const url = file ? await upload(file) : "";
    try {
        // Envoyer les données au backend
        const response = await newRequest.post("/category", {
            ...state,
            img: url,
        });
        alert("Catégorie ajoutée avec succès.");
    } catch (error) {
        // Gérer les erreurs d'envoi
        if (error.response.status === 400 && error.response.data.message === "La catégorie existe déjà.") {
            alert("La catégorie existe déjà.");
        } else {
            console.error('Erreur lors de l\'envoi des données au backend:', error);
        }
    }
};


  return (
    <div className="add">
      <div className="container">
        <h1>Ajouter Catégorie</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="categoryName">Nom Catégorie </label>
            <input
              type="text"
              name="title"
              placeholder=""
              onChange={handleChange}
            />
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="image">Image de Catégorie</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
            
            <button onClick={handleSubmit}>Créer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategorie;
