import React, { useState, useEffect } from 'react';

const DogAPI = 'https://api.thedogapi.com/v1/images/search';
const DogBreedsAPI = 'https://api.thedogapi.com/v1/breeds';

function App() {
  const [dogImage, setDogImage] = useState('');
  const [dogAttributes, setDogAttributes] = useState([]);
  const [bannedAttributes, setBannedAttributes] = useState([]);

  // Fetch a random dog image from the API based on the banned attributes
  const fetchDogImage = () => {
    let apiUrl = DogAPI;
    if (bannedAttributes.length > 0) {
      const breedIds = dogAttributes
        .filter((attribute) => bannedAttributes.includes(attribute.name))
        .map((attribute) => attribute.id);
      if (breedIds.length > 0) {
        apiUrl += `?exclude_breed_id=${breedIds.join(',')}`;
      }
    }
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setDogImage(data[0].url);
      })
      .catch((error) => console.log(error));
  };

  // Fetch all dog breeds and their attributes from the API
  useEffect(() => {
    fetch(DogBreedsAPI, {
      headers: {
        'X-API-KEY': 'live_Td7t3Lp7RGh38vjPwZIzyAKiI1c9GEZV6yK1XYVyuaUyATqpqS2OpSS2Klt5K2pM',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const attributes = data.map((breed) => {
          return {
            id: breed.id,
            name: breed.name,
            subAttributes: [
              breed.weight.metric,
              breed.height.metric,
              ...(breed.temperament ? breed.temperament.split(',').map((t) => t.trim()) : []),
            ],
          };
        });
        setDogAttributes(attributes);
      })
      .catch((error) => console.log(error));
  }, []);

  // Handle adding or removing attributes from the banned attributes list
  const handleAttributeToggle = (attribute) => {
    if (bannedAttributes.includes(attribute)) {
      setBannedAttributes((prev) => prev.filter((a) => a !== attribute));
    } else {
      setBannedAttributes((prev) => [...prev, attribute]);
    }
  };

  return (
    <div className="App">
      <h1>Dog Image</h1>
      <img src={dogImage} alt="A random dog" height='500' width='500'/>

      <button onClick={fetchDogImage}>Get Another Dog</button>

      <h1>Attributes</h1>
      <ul>
        {dogAttributes.map((attribute) => (
          <li key={attribute.id}>
            <label>
              <input
                type="checkbox"
                checked={bannedAttributes.includes(attribute.name)}
                onChange={() => handleAttributeToggle(attribute.name)}
              />
              {attribute.name}: {attribute.subAttributes.join(', ')}
            </label>
          </li>
        ))}
      </ul>

      <h1>Banned Attributes</h1>
      <ul>
        {bannedAttributes.map((attribute) => (
          <li key={attribute}>{attribute}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
