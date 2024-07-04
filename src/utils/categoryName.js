import newRequest from "./newRequest";

const getCategoryName = async (categoryId) => {
    try {
      const response = await newRequest.get(`/category/${categoryId}`);
      return response.data.categoryName;
    } catch (error) {
      console.error("Erreur lors de la récupération du nom de la catégorie :", error);
      return ""; // Retourne une chaîne vide en cas d'erreur
    }
  };

  export default getCategoryName