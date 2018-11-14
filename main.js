
function getResourceObject(){
  var services = map.querySourceFeatures('composite', {sourceLayer: 'refugees-services'});
  var menuObject = {};
    for (var i = 0; i < services.length; i++) {
      var type = services[i].properties.type; 
      if ( ! Object.keys(menuObject).includes(type) ) {
        menuObject[type] = []; 
      }
      menuObject[type].push(services[i].properties); 
    }
  return menuObject; 
}


function makeSectionHeader(category){
  var icon = document.createElement('i'),
      resourceName = document.createElement('p'), 
      chevron = document.createElement('chevron'),
      liEntry = document.createElement('li'),
      aEntry = document.createElement('a'),
      categoryId = category.toLowerCase().split(" ").join('-');

  icon.className = 'fa fa-home inl-bl mr-2'; 

  resourceName.className = 'inl-bl';
  resourceName.innerText = category;

  chevron.className = 'fa fa-chevron-down inl-bl ml-2';

  aEntry.href = "#" + categoryId; 
  

  liEntry.className = 'link--lighten75 pl-2 bg-transparent';
  liEntry.setAttribute('data-toggle', 'collapse');
  liEntry.setAttribute('data-target', '.' + categoryId); 
  liEntry.appendChild(aEntry); 
  liEntry.appendChild(icon);
  liEntry.appendChild(resourceName);
  liEntry.appendChild(chevron);

  return liEntry; 
}

function makeResourceEntry(resourceObject) {
  var liContainer = document.createElement('li'); 
  var liList = document.createElement('a');
  liList.id = resourceObject.name.toLowerCase().split(" ").join('-'); 
  liList.href = liList.website; 
  liList.innerText = resourceObject.name;
  liList.className = 'link--lighten75';

  liContainer.appendChild(liList); 

  return liContainer; 
}

function makeSection(category){  
  var categoryId = category.toLowerCase().split(" ").join('-'); 
  var resourceObject = getResourceObject(); 
  var ulResource = document.createElement('ul');
  ulResource.className = 'list-group list-group-item pre-scrollable pl-3 bg-transparent border--0'; 

    for (var i = 0; i < resourceObject[category].length; i++ ) {
      var entry = makeResourceEntry(resourceObject[category][i]);
      entry.className = 'link--lighten75 m-2 pb-2 collapse bg-transparent ' + categoryId; 
      ulResource.appendChild(entry);
  }

  return ulResource; 
};


function assembleMenu(){
  var context = document.getElementById('menu_container');
  var menuObject = getResourceObject();
  var sectionHeads = Object.keys(menuObject); 
  
  for (var i = 0; i < sectionHeads.length; i++) {
      var header = makeSectionHeader(sectionHeads[i]);
      var section = makeSection(sectionHeads[i]);
      header.appendChild(section); 
      context.appendChild(header);
  }
};
