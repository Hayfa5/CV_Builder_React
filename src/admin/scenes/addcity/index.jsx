import React, { useReducer, useState, useEffect } from "react";
import "../../AddCategorie.scss";
import newRequest from "../../../utils/newRequest";
import { useNavigate } from "react-router-dom";

// Définition de l'état initial
const INITIAL_STATE = {
  name: "",
  features: [],
  countries: [],
  selectedcountries: ""
};

// Reducer pour gérer l'état
const AddCityReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return { ...state, [action.payload.name]: action.payload.value };
    case "ADD_FEATURE":
      return { ...state, features: [...state.features, action.payload] };
    case "SET_COUNTRIES":
      return { ...state, countries: action.payload };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter((feature) => feature !== action.payload)
      };
    default:
      return state;
  }
};

const AddCity = () => {
  const [state, dispatch] = useReducer(AddCityReducer, INITIAL_STATE);
  const navigate = useNavigate();

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value }
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const cityValue = e.target.parentElement.querySelector("input[name='city']").value;
    if (cityValue.trim() !== "") {
      dispatch({
        type: "ADD_FEATURE",
        payload: { name: cityValue }
      });
    }
    e.target.parentElement.querySelector("input[name='city']").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.selectedcountries) {
      alert("Veuillez sélectionner un pays.");
      return;
    }
    if (state.features.length === 0) {
      alert("Veuillez ajouter au moins une ville.");
      return;
    }
  
    try {
      const response = await newRequest.post("/countrycity/cities", {
        ...state,
        name: state.features,
        country: state.selectedcountries,
      });
      alert("Villes ajoutées avec succès.");
      navigate("/"); // Rediriger vers une autre page après l'ajout réussi
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === "Le nom de la ville existe déjà pour ce pays.") {
        alert("Le nom de la ville existe déjà pour ce pays.");
      } else {
        console.error("Erreur lors de l'envoi des données au backend:", error);
      }
    }
  };
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await newRequest.get("/countrycity/countries");
        dispatch({ type: "SET_COUNTRIES", payload: response.data });
      } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="add">
      <div className="container">
        <h1>Ajouter Les Villes</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="category">Choisir un Pays</label>
            <select
              name="selectedcountries"
              value={state.selectedcountries}
              onChange={handleChange}
            >
              <option value="">Sélectionner un pays</option>
              {state.countries.map((country, index) => (
                <option key={index} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>

            <label htmlFor="subCategory">Ajoutez Les Villes de ce pays</label>
            <form action="" className="add" onSubmit={handleSubmit}>
              <input type="text" name="city" placeholder="" onChange={handleChange} />
              <button type="button" onClick={handleFeature}>Ajouter</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f, index) => (
                <div className="item" key={index}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f.name}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <button type="submit" onClick={handleSubmit}>Créer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCity;
