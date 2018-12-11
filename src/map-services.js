
export const getResourceObject = (sources) => {
  const resourceObject = sources.map( i => {
      const resource = i.properties; 
      resource.coordinates = i.geometry.coordinates; 
      resource.lngLat = i.lngLat; 
      return resource; 
    }); 
  return resourceObject; 
}

// get the types from mapbox data
export const getCategories = (sources) => sources.map(source => source.properties.type)
    .filter((value, index, self) => self.indexOf(value) === index ) ;

export const makeResourceEntry = (resourceObject) =>{
  const liLink = document.createElement('a');
  const liList = document.createElement('li'); 
  const liContainer = document.createElement('div'); 
  liLink.id = resourceObject.name.toLowerCase().split(" ").join('-'); 
  const name = resourceObject.name; 
  const website = resourceObject.website;
  const bio = resourceObject.bio;
  const telephone = resourceObject.telephone;
  const coordinates = resourceObject.coordinates; 
 
  // liLink.onclick = (e) => new mapboxgl.Popup()
  //     .setLngLat(coordinates)
  //     .setHTML('<h4>' + name + '</h4><a href=' + website + '>' + website + '</a><br><br><i>' + bio + '</i><br><br><b>Telephone: </b>' + telephone)
  //     // .addTo(map);

  liContainer.id = resourceObject.name; 
  liLink.innerHTML = resourceObject.name;
  liLink.className = 'resource-entry';
  liList.className = 'collapsed '+ liLink.id;
  liContainer.className = 'resource-entry-box';
  
  liContainer.appendChild(liLink); 
  liList.appendChild(liContainer); 

  return liList; 
}


