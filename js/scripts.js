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
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        .add(pokemon)
      }).catch(function(e){
      console.error(e);
    });
  }


  function loadDetails(item){
    var url = item.detailsUrl;
    return $.ajax(url).then(function(details){
      console.log('Item details', details);
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

var $pokemonList = $('.pokemon-list');

function addListItem(pokemon){
  var listItem = $('<li></li>');
  var button = $('<button class="pokemon-list_style">' + pokemon.name + '</button>');
  listItem.append(button);
  $pokemonList.append(listItem);
  button.on('click', () => {
    showDetails(pokemon)
  });
}

/*************
Display modal about pokemon details
**************/
var $modalContainer = $('#modal-container');

function showDetails(pokemon){
  pokemonRepository.loadDetails(pokemon).then(function() {
    showModal(pokemon);
  });
}

function showModal(pokemon) {
  var modal = $('<div class="modal"></div>');

  var exist = $modalContainer.$('.modal');

  // Add the new modal content
  var closeButton = $('<button class="modal-close">Close</button>');
  closeButton.on('click', hideModal);

  if(exist)$modalContainer.removeChild(exist);

  var name = $('<h1>' + pokemon.name + '</h1>');

  var height = $('<p>Height: ' + pokemon.height + '</p>');

  var image = $('<img></img>');
  image.attr('src', pokemon.imageUrl);

  modal
  .apend(closeButton)
  .append(name)
  .append(height)
  .append(image)

  $modalContainer
  .append(modal)
  .addClass('is-visible')
}

/**************
Hide pokemon details
***************/

function hideModal() {
  $modalContainer.removeClass('is-visible');
}

$(window).on('keydown', (e) => {
  if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')){
    hideModal();
  }
})

pokemonRepository.loadList().then(function(){
  pokemonRepository.getAll().each(function(pokemon){
    addListItem(pokemon);
  });
});
})();
