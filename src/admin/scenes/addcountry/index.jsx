import React, { useReducer, useState } from "react";
import "../../AddCategorie.scss";
import newRequest from "../../../utils/newRequest";
import upload from "../../../utils/upload";
import { useNavigate } from "react-router-dom";


// Définition de l'état initial
const INITIAL_STATE = {
  title: "",
};

// Reducer pour gérer l'état
const formReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return { ...state, [action.payload.name]: action.payload.value };
    default:
      return state;
  }
};

const AddCountry = () => {

  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const navigate = useNavigate(); // Hook de navigation

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.title) {
      alert("Veuillez remplir le champ Nom Pays.");
      return; // Arrêter l'exécution de la fonction si le champ est vide
    }
  
    try {
      // Envoyer les données au backend
      const response = await newRequest.post("/countrycity/countries", {
        name: state.title,
      });
      alert("Pays ajoutée avec succès.");

    } catch (error) {
      // Gérer les erreurs d'envoi
      if (error.response.status === 400 && error.response.data.message === "Le pays existe déjà.") {
        alert("Le pays existe déjà.");
      } else {
        console.error('Erreur lors de l\'envoi des données au backend:', error);
      }
    }
  };
  

  return (
    <div className="add">
      <div className="container">
        <h1>Ajouter Un Pays</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="categoryName">Nom de Pays </label>
            <input
              type="text"
              name="title"
              placeholder=""
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Créer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCountry;
