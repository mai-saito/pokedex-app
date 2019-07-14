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
      item.types = Object.keys(details.types);
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

var $pokemonList = $('pokemon-list')

function addListItem(pokemon){
  var listItem = $('.pokemon-list_item');
  listItem.text(pokemon.name);
  $pokemonList.append(listItem);
}

/*************
Display modal about pokemon details
**************/

function showDetails(pokemon){
  pokemonRepository.loadDetails(pokemon).then(function() {

    var name = $('#pokemon-name').text(pokemon.name);

    var height = $('.modal-body').text(pokemon.height);

    var image = $('#pokemon-picture');
    image.attr('src', pokemon.imageUrl);
  });
}

pokemonRepository.loadList().then(function(){
  var pokemons = pokemonRepository.getAll();

  $.each(pokemons, function(index, pokemon){
        addListItem(pokemon);
  });
});
})();
