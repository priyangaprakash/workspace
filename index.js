//*NOTE: All response from API Call will contain the following structure
/*


 {
 "status": "success",=====> will contain either 'success' or 'failure'
 "code": 200,======> status code Ex:404,500,200
 "data": {},====>>requested data
 "error": ""====>>if any errors
 }


 */

/*Service Factory for API Calls*/

/*

 create a service module using factory and 'ngResource' as dependency.

 This Service Should contain the configuration objects for the following APIs.

 1.To create a book
 =======================
 url:http://localhost:3000/book
 method:POST
 input data format:{name:'', description:'', price:'', category:''}

 2.To update a book
 =======================
 url:http://localhost:3000/book/id
 method:PUT
 input data format:{name:'', description:'', price:'', category:''}
 note:Here id is the id of book.

 3.To remove a book
 ========================
 url:http://localhost:3000/book/id
 method:DELETE
 note:Here id is the id of book.

 */
BookService.$inject = ['$http'];
function BookService($http)
{
    var service = this;
    service.getBookCategories = function(){
        var response = $http({
            url:"http://localhost:3000/products",
            method:"GET"
        });
        return response;
    };

    service.createBook = function(bookdata)
    {
        console.log("inside post",bookdata.name);
            var response = $http({
            url:"http://localhost:3000/product",
            method:"POST",
            data: bookdata
        });
        return response;
    };

    service.deleteBook = function(book)
    {
        console.log("Book",book);
        var response = $http({
            url:"http://localhost:3000/product/"+ book._id,
            method:"DELETE"
        });
        return response;
    };
     service.editBook = function(bookdata,id)
    {
         console.log("inside put",id);
            var response = $http({
            url:"http://localhost:3000/product/" + id,
            method:"PUT",
            data: bookdata
        });
        return response;
    };
};
/*End of Service Factory*/

/*Create Angular Module*/

/*
 create a angular module in the name of 'Capstone' and put 'ui.router' as first dependency
 and the Service you have created above as a second dependency.
 */
angular.module('Capstone',['ui.router'])
.service('BookService',BookService)
.controller('BookListController',BookListController)
.controller('BookCreateController',BookCreateController)
.controller('BookEditController',BookEditController)
.config(routeConfig);
/*End Of Module Creation*/

/*App Route Config*/

/*
 create following states here for Capstone for navigation.using the state provider.

 1.book List
 ================
 *use the page public/pages/list.html
 *define your own controller for this state.

 2.book creation
 ===================
 *use the page public/pages/book.html
 *define your own controller for this state.


 3.book update
 =================
 *use the page public/pages/book.html
 *define your own controller for this state.

 use the Url route provider to set the default opening page.
 */
routeConfig.$inject = ['$stateProvider','$urlRouterProvider'];
function routeConfig($stateProvider,$urlRouterProvider)
{
    // $urlRouterProvider.when(" ","/list");
    $urlRouterProvider.otherwise("/list");
    $stateProvider
    .state('list',{
        url:'/list',
        templateUrl:'../pages/list.html'
    })
    .state('create',{
        url:'/create',
        templateUrl:'../pages/book.html',
        params: {
				name: null,
				id:null,
				category:null,
				price:null,
				description:null
			}
    })
    .state('edit',{
        url:'/edit',
        templateUrl:'../pages/new.html'
    });
}

/*End of Route Config*/




/*Book List Controller
 ==============================

 1.write your code to get list of Books using http provider in angularJs.

 URL: url:http://localhost:3000/Books
 method:GET

 2.after getting the list of Books, iterate the html elements to show all the Books as shown in requirement Document and
 iterate the Book list and get the unique category list.

 using this unique category list, display the categories in category filter section as shown in requirement Document .
 add "All Categories" as default in category filer section.

 3.write a function to filter the Books when a category is clicked in category filter section
 when "All categories" Clicked, show All Books.

 4.when edit button clicked, app should go to Book edit state.write a function to do that.

 5.when remove button clicked, a bootstrap modal should open to confirm the removal. upon confirmation,
 Book should be removed from the database. an alert message should be shown in green/Red upon successful/unsuccessful removal

 this alert messages should be hidden in 3 seconds. use timeout provider in angularJs for that.

 use the configured service object to make API call for removal.


 * */
BookListController.$inject = ['BookService','$state'];
function BookListController(BookService,$state)
{
    var book = this;
    var promise = BookService.getBookCategories();
    promise.then(function(success)
    { 
        book.categories = success.data.data;
        console.log("Success",success.data);
    });

    book.deleteBook = function(item)
    {
      var promise = BookService.deleteBook(item);
      promise.then(function(success)
      {
          console.log("Delete success");
       var index = book.categories.indexOf(item);
       book.categories.splice(index,1);
      });
    };

    book.editBook = function(book)
    {
        console.log('well',book);
       $state.go('create',{id:book._id,name:book.name,category:book.category,price:book.price,description:book.description});
        
    }

   
}
/*End of Book List Controller*/

/*Book Create Controller
 ================================
 1. write a function to save the Book.
 call this function when submit button in Book page clicked.

 an alert message should be shown in green/Red upon successful/unsuccessful creation of Book

 after successful creation of Book, app should navigate to list page(Book list state)
 use the configured service object to make API call for Creating Book.

 2.write a function to remove the form values in the Book page.
 call this function when cancel button in Book page clicked.

 * */

BookCreateController.$inject = ['BookService','$stateParams'];
function BookCreateController(BookService,$stateParams)
{
var book = this;
book.submit = true;
book.update = false;
book. cancel = false;
  
    book.createBook = function()
    {
        var bookdata = {name:book.name,description:book.description,price:book.price,category:book.category};
        console.log("Bookdata",bookdata.name);
       var promise = BookService.createBook(bookdata);
       promise.then(function(success)
      {
      // book.users.push(success.data);
       console.log("New book",success.data);
      });
    }
    book.updateUser = function()
    {
         book.id = $stateParams.id;
         console.log("Book id",book.id);
         var bookdata = {name:book.name,description:book.description,price:book.price,category:book.category};
        // console.log("Upp",id);
      var promise = BookService.editBook(bookdata,book.id);
      promise.then(function(success)
      {
      // book.users.push(success.data);
       console.log("New upodates book",success.data);
      });
    }
    
}
/*End of Book Create Controller*/

/*Book edit Controller
 ================================

 1.populate the details of the Book which is going to be updated into form using 2 way binding.

 2. write a function to update the Book.
 call this function when submit button in Book page clicked.

 an alert message should be shown in green/Red upon successful/unsuccessful update of Book

 after successful update of Book, app should navigate to list page(Book list state)

 3.write a function to remove the form values in the Book page.
 call this function when cancel button in Book page clicked.

 * */
BookEditController.$inject = ['BookService'];
function BookEditController(BookService)
{
//  var book = this;
//  book.updateUser = function(item)
//  {
//     var bookdata =  {name:book.name,description:book.description,price:book.price,category:book.category};
//     var promise = BookService.editBook(bookdata,item);
//     promise.then(function(success){
//       console.log("Updated");
//     });
//  }   
}
/*End of Book edit Controller*/