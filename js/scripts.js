(function(){
var pokemonRepository = (function(){
  var repository =[];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll(){
    return repository;
  }

  function add(item){
    repository.push(item);
  }

  function loadList(){
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(item){

      $.each(item.results, function(index, item){
        //Uncomment the line below to see index in the callback function in $.each()
        //console.log('response object ', index);
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        add(pokemon)
      })

      }).catch(function(e){
      console.error(e);
    });
  }


  function loadDetails(item){
    var url = item.detailsUrl;
    return $.ajax(url).then(function(details){
      //Uncomment the line below to log index
      //console.log('Item details', details);
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types.map(function(pokemon){
          return pokemon.type.name;
      });
      //Uncommentthe line below to see types
      //console.log(item.types);
    }).catch(function(e){
      console.error(e);
    });
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

var $pokemonList = $('.pokemon-list')

function addListItem(pokemon){
  var listItem = $('<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal"></button>');
  listItem.text(pokemon.name);
  $pokemonList.append(listItem);
//Uncomment the line below if you want to see the list of pokemon.
//console.log(pokemon);
  listItem.click(function() {
    showDetails(pokemon)
  });
}

/*************
Display modal about pokemon details
**************/

function showDetails(pokemon){
  pokemonRepository.loadDetails(pokemon).then(function() {
    var modal = $('.modal-body');
    var name = $('.modal-title').text(pokemon.name);
    var height = $('<p class="pokemon-height"></p>').text('Height: ' + pokemon.height);
    var type = $('<p class="pokemon-type"></p>').text('Type: ' + pokemon.types);
    var image = $('<img class="pokemon-picture">');
    image.attr('src', pokemon.imageUrl);


    if(modal.children().length) {
      modal.children().remove();
    }

    modal.append(image)
         .append(height)
         .append(type);

  });
}

pokemonRepository.loadList().then(function(){
  var pokemons = pokemonRepository.getAll();

  $.each(pokemons, function(index, pokemon){
        addListItem(pokemon);
  });
});
})();
