var BASE_URL = 'http://localhost:3000';
var app=angular.module('Capstone',['ui.router','ngResource']);
/*Service Factory for API Calls*/
app.factory('bookService' ,function ($resource) {
    return $resource(BASE_URL + '/product/:id', {id:"@id"},{
	  save:{
          method:'POST'
          },
	  update:{
          method:'PUT'
          },
      delete:{
          method:'DELETE'
          }
      });
      return data;
});
/*Start of Route Config*/
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "/list");
	$stateProvider
		.state('create', {
		  url: '/create',
		  templateUrl: '../pages/book.html',
		  controller:'createController'
		 
		})
		.state('list', {
		  url: '/list',
		  templateUrl: '../pages/list.html',
		   controller:'bookListController'
		  
		})
		.state('edit', {
			  url: '/edit/:id',
			  templateUrl: '../pages/book.html',
			  controller:'editController',
			   params: {
				name: null,
				id:null,
				category:null,
				price:null,
				description:null
			}
    });

	
}]);

	
/*End of Route Config*/

/*Book List Controller*/
	app.controller('bookListController',function($scope,$http,$state,bookService){
		$scope.selectedCategory='All Categories';
		$scope.selectedCat='';
		$scope.deleteId='';
		$scope.getBooks=function(){
			$http.get(BASE_URL + '/products/').success(function(response) {
				$scope.books=response.data;
				$scope.uniqueCategories = [];
				$scope.uniqueCategories[0]='All Categories';
	            for(i = 0; i< $scope.books.length; i++){    
		         if($scope.uniqueCategories.indexOf($scope.books[i].category) === -1){
			        $scope.uniqueCategories.push($scope.books[i].category);        
		           }        
	            }
		});	
	}
		$scope.getBooks();
		$scope.deleteConfirm=function(id){
			$scope.deleteId=id;
			$("#deleteConfirm").modal('show');
		}
		$scope.delete_book=function(){
			
			bookService.delete({id:$scope.deleteId}, function(resp){
			$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
				   $("#success-alert").slideUp(500);
					});
					$scope.getBooks();
					
		});
		}
		
		$scope.edit=function(book){
			
			$state.go('edit',{id:book._id,name:book.name,category:book.category,price:book.price,description:book.description});
		}
		$scope.filterCategory=function(category){
			$scope.selectedCategory=category;
			if(category=="All Categories"){
				$scope.selectedCat='';
			}else{
				$scope.selectedCat=category;
			}
			
			
			
		}
		
	});

/*Book Create Controller*/
app.controller('createController',function($scope,$http,bookService){
	$scope.update=false;
	$scope.create=function(){
		
        var data = {
                name:$scope.name, description:$scope.description, price:$scope.price, category:$scope.category
        };
        bookService.save(data, function(response) {
			$("#success-create").fadeTo(2000, 500).slideUp(500, function(){
               $("#success-create").slideUp(500);
                });
               
        });
   
	}
	
	$scope.cancel=function(){
		$scope.name='';
		$scope.description='';
		$scope.price='';
		$scope.category='';		
	}
});
/*Book Edit Controller*/
app.controller('editController',function($scope,$stateParams,bookService){
	$scope.update=true;
	$scope.name=$stateParams.name;
	$scope.description=$stateParams.description;
	$scope.price=$stateParams.price;
	$scope.category=$stateParams.category;	
	$scope.id=$stateParams.id;
	$scope.update = function() {
	var data = {
			name:$scope.name, description:$scope.description, price:$scope.price, category:$scope.category
	};
	bookService.update({id: $scope.id},data, function(response) {
			$("#success-update").fadeTo(2000, 500).slideUp(500, function(){
					$("#success-update").slideUp(500);
				});
			});
    };
	$scope.cancel=function(){
		$scope.name='';
		$scope.description='';
		$scope.price='';
		$scope.category='';		
	}
	
});
