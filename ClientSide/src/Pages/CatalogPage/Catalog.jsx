import React, { useEffect, useState } from "react";
import ModeIcon from '@mui/icons-material/Mode';
import "./CatalogCss.css";

  const imageContext = require.context('../../images', true, /\.(jpg|jpeg|png|gif)$/);
  const getImages = () => {
    const images = imageContext.keys().map(imageContext);
    return images;
  };

  const Catalog = () => {
  const [plants, setPlants] = useState([]);
  const plantImages = getImages();
  useEffect(() => {
    fetch('https://proj.ruppin.ac.il/cgroup96/prod/api/inventoryItems/get') 
      .then(response => response.json())
      .then(data => setPlants(data))
      .catch(error => console.error('Error:', error));
  }, []);
  const groupedPlants = plants.reduce((acc, plant) => {
  if (plant.itemCategory) {
    acc[plant.itemCategory] = acc[plant.itemCategory] || [];
    acc[plant.itemCategory].push(plant);
  }
  return acc;
}, {});


return (
  <div className="plant-catalog">
    {Object.entries(groupedPlants).map(([category, categoryPlants]) => (
      <div key={category} className={`plant-category ${category}`}>
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <div className="plants">
          {categoryPlants.map(plant => (
            <div key={plant.id} className="plant-card">
              <img src={plant.itemPicture} alt={plant.name} />
              <h3>{plant.itemName}</h3>
              <p>כמות במלאי: {plant.itemAmount}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};

export default Catalog;