import React, { useState, useEffect } from 'react';
import "./App.css";

const DogAPI = 'https://api.thedogapi.com/v1/images/search';
const DogBreedsAPI = 'https://api.thedogapi.com/v1/breeds';

function App() {
  const [dogImage, setDogImage] = useState('');
  const [currAttributes, setCurrAttributes] = useState([]);
  const [dogDict, setDogDict] = useState([]);
  const [dogAttributes, setAttributes] = useState([]);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [prevImages, setPrevImages] = useState([]);

  //button that will generate a picture of a dog based on the criteria of a ban list
  //the button will also generate a div that maps out buttons of random attributes of that dog that the user may click to add to a banList
  //a pevImage gallery will be on the side
  //a banList component will be on the side as well


  const fetchDogImage = (id) => {
    fetch(DogAPI + "?breed_id=" + id)
      .then((response) => response.json())
      .then((data) => {
        setDogImage(data[0].url);
        setPrevImages((prev) => [...prev, data[0].url]);
      })
      .catch((error) => console.log(error));
  };

  // Fetch a random dog image from the API based on the banned attributes
  const imageGenerator = () => {
    //generate number between 1-264, which is the includes all ids of all dogs.
    for(let i = 0; i < 100; i++) {
      const randomNum = Math.floor(Math.random() * 264);
      const attributes = dogDict[randomNum].subAttributes
      for(let i = 0; i < attributes.length; i++){
        if(bannedAttributes.includes(attributes[i])){
          break;
        }
        if(i === attributes.length - 1){
          fetchDogImage(dogDict[randomNum].id)
          setCurrAttributes(attributes)
          return;
        }
      }
    }
    fetchDogImage(1);
  }



  // Fetch all dog breeds and their attributes from the API
  useEffect(() => {
    fetch(DogBreedsAPI, {
      headers: {
        'X-API-KEY': 'live_Td7t3Lp7RGh38vjPwZIzyAKiI1c9GEZV6yK1XYVyuaUyATqpqS2OpSS2Klt5K2pM',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const dict = data.map((breed) => {
          return {
            id: breed.id,
            name: breed.name,
            subAttributes: [
              breed.origin, 
              breed.life_span,
              breed.breed_group,
              ...(breed.temperament ? breed.temperament.split(',').map((t) => t.trim()) : []),
            ]
          };
        });
        setDogDict(dict);
      })          
      .catch((error) => console.log(error));
      console.log(dogDict)
      let attributes = []
      for(let i = 0; i < dogDict.length; i++){
        for(let x = 0; x < dogDict[i].subAttributes.length; x++){
          attributes.push(dogDict[i].subAttributes[x]);
        }
      }
      setAttributes(attributes);
      console.log(dogAttributes);
    }, []);




  // Handle adding or removing attributes from the banned attributes list
  const handleAttributeToggle = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes((prev) => [...prev, attribute]);
    }
  };

  return (
    <div className="App">
      <div className='section'>
      <h1>Dog Image</h1>
      <img src={dogImage} alt="A random dog" height='300' width='300'/>
      <button className='section' onClick={imageGenerator}>Get Another Dog</button>
      </div>

      <div className='section'>
      <h2>Attributes</h2>
      {currAttributes.length > 0 ? currAttributes.map((attribute) => (
        <button className='section' onClick={() => handleAttributeToggle(attribute)}>{attribute}</button>
      )) : (<div></div>)}
      </div>
      
      <div className='section'>
      <h2>BannedAttributes</h2>
      {bannedAttributes.length > 0 ? bannedAttributes.map((attribute) => (
        <p>{attribute}</p>
      )) : (<div></div>)}
      </div>

      <div className='section'>
        <h2>Images Viewed so Far</h2>
        {prevImages.length > 0 ? prevImages.map((url) => (
        <img src={url} height='100' width='100'/>
      )) : (<div></div>)}
      </div>
    </div>
  );
}

export default App;
