(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'itemsFoundList.html',
    scope: {
      itemsFound: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}



NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.searchTerm = "";
  menu.userMessage = "";
  menu.foundItems = [];

  menu.removeItem = function (itemIndex) {
    menu.foundItems.splice(itemIndex,1);
};

  menu.getMatchedMenuItems  = function () {
    console.log("searchTerm is:" + menu.searchTerm);
    menu.foundItems = [];
    menu.userMessage = "";
    if(menu.searchTerm == ""){
        menu.userMessage = "Nothing found";
      return;
    }

    var promise = MenuSearchService.getAllItems();

    promise.then(function (response) {
      console.log(response.data.menu_items);
      for (var i = 0; i < response.data.menu_items.length; i++) {
       if (response.data.menu_items[i].description.toLowerCase().indexOf(menu.searchTerm.toLowerCase()) > 0) {
          menu.foundItems.push(response.data.menu_items[i])
        }
      }

      if(menu.foundItems.length == 0){
          menu.userMessage = "Nothing found";
        return;
      }

    })
    .catch(function (error) {
      console.log(error);
    })
  };


}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getAllItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    return response;
  };
}

})();
