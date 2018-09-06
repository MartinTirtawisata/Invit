// let MOCK_SELLER_DATA = {
//     "seller_id": "112233",
//     "seller_name": {
//         "firstName": "Moscato",
//         "lastName": "Hokaido"
//     },
//     "username": "seller",
//     "email": "seller@gmail.com",
//     "password": "selleriscool",
//     "products": "product_id"
// }

const PRODUCT_URL = '/api/products'
const SELLER_URL = '/api/sellers'



function getProductData(callback){
    $.getJSON(PRODUCT_URL, callback)
}
function displayProductData(product_data){
    // console.log(data)
    product_data.map(((d, index) => {
        // console.log(index)
        // console.log(d)
        $('.js-product-data').append(`<tr><td>${index + 1}</td><td>${d.product_img}</td><td>${d.product_name}</td><td>${d.product_desc}</td><td>${d.price}</td></tr>`)
    }))
    
}
function getAndDisplayProduct(){
    getProductData(displayProductData)
}

function getAndDisplaySeller(){
    $.getJSON(SELLER_URL, function(seller_data) {
        // console.log(seller_data)
        seller_data.map(s => {
            $('.js-seller-name').html(`${s.firstName} ${s.lastName}`)
            $('.js-seller-username').html(`${s.userName}`)
        })
    })
}

$(getAndDisplayProduct());
$(getAndDisplaySeller());


// function addShoppingItem(item) {
//     console.log('Adding shopping item: ' + item);
//     $.ajax({
//       method: 'POST',
//       url: SHOPPING_LIST_URL,
//       data: JSON.stringify(item),
//       success: function(data) {
//         getAndDisplayShoppingList();
//       },
//       dataType: 'json',
//       contentType: 'application/json'
//     });
//   }


// function handleShoppingListAdd() {

//     $('#js-shopping-list-form').submit(function(e) {
//       e.preventDefault();
//       addShoppingItem({
//         name: $(e.currentTarget).find('#js-new-item').val(),
//         checked: false
//       });
//     });
  
//   }