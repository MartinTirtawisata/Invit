'use strict';
const PRODUCT_URL = '/api/products'
const SELLER_URL = '/api/sellers'

// Gets the Product API and display the product list
function getAndDisplayProductList(){
    console.log('retrieving product data API')
    $.getJSON(PRODUCT_URL, function (product_data){
        console.log("Rendering product data")
        let productData = product_data.map((d, index) => {
            console.log(d)
            return `<tr class="js-product-data" id=${d._id}>
            <td>${index + 1}</td>
            <td><img class="product-img" src="/img/iPhone_Xs.jpeg" alt="iPhone-X"></td>
            <td>${d.product_name}</td>
            <td>${d.product_desc}</td>
            <td>${d.price}</td>
            <td>
                <button id="update-modal-btn" class="js-edit-btn"><i class="far fa-edit"></i></button>
                <button class="js-dlt-btn"><i class="fa fa-trash" aria-hidden="true"></i></button>    
            </td>
            </tr>`;
        });
        $('.js-product-table-body').html(productData)
    })    
}


//-----
//Gets Seller API and display it
function getAndDisplaySeller(){
    $.getJSON(SELLER_URL, function(seller_data) {
        // console.log(seller_data)
        seller_data.map(s => {
            $('.js-seller-name').html(`${s.firstName} ${s.lastName}`)
            $('.js-seller-username').html(`${s.userName}`)
        })
    })
}

$(getAndDisplayProductList());
$(getAndDisplaySeller());

// -----
// Add Product Modal & API

$('#add-modal-btn').on('click', function(){
    $('#add-product-modal').css('display','block');
})

$('.close-btn').on('click', function(){
    $('#add-product-modal').css('display','none');
})

function addProducts(product){
    console.log('adding product ' + JSON.stringify(product));
    $.ajax({
        method: 'POST',
        url: PRODUCT_URL,
        data: JSON.stringify(product),
        success: function(data){
            getAndDisplayProductList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function handleAddProduct(){
    $('.add-product-form').submit(function(e){
        e.preventDefault();
        console.log('handling add product')
        addProducts({
            seller: '5b857955583d649b45df849d',
            product_name: $(e.currentTarget).find('#productName').val(),
            product_desc: $(e.currentTarget).find('#productDesc').val(),
            product_img: $(e.currentTarget).find('#productImg').val(),
            price: $(e.currentTarget).find('#productPrice').val()
        })
        console.log($(e.currentTarget).find('#productImg').val())
    })
}

$(handleAddProduct());

// -----
// Update Product Modal

$('.js-product-table').on('click','#update-modal-btn', function(){
    $('#update-product-modal').css('display','block');
})

$('.close-btn').on('click', function(){
    $('#update-product-modal').css('display','none');
})

function getProductId(){
    $('.js-product-table').on('click', '.js-edit-btn', function(e){
        e.preventDefault();
        let productID = $(e.currentTarget).closest('tr').attr('id')
        console.log(productID);
        $('.update-legend').text(`Updating Product ID:${productID}`)
        handleProductUpdate(productID);
    })
}

function handleProductUpdate(productID){
    $('.js-update-product-form').submit(function(e){
        e.preventDefault();
        console.log(productID)
        console.log('handling updating data')
        updateProductData({
            _id: productID,
            product_name: $(e.currentTarget).find('#productName').val(),
            product_desc: $(e.currentTarget).find('#productDesc').val(),
            product_img: 'some picture',
            price: $(e.currentTarget).find('#productPrice').val()
        })
    })
}

function updateProductData(product){
    console.log(JSON.stringify(product))
    $.ajax({
        method: 'PUT',
        url: PRODUCT_URL + "/" + product._id,
        data: JSON.stringify(product),
        success: function(data){
            getAndDisplayProductList();
        },
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(getProductId());

// function updateShoppingListitem(item) {
//     console.log("Updating shopping list item `" + item.id + "`");
//     $.ajax({
//       url: SHOPPING_LIST_URL + "/" + item.id,
//       method: "PUT",
//       data: JSON.stringify(item),
//       success: function(data) {
//         getAndDisplayShoppingList();
//       },
//       dataType: "json",
//       contentType: "application/json"
//     });
//   }

//   function handleShoppingCheckedToggle() {
//     $(".js-shopping-list").on("click", ".js-shopping-item-toggle", function(e) {
//       e.preventDefault();
//       var element = $(e.currentTarget).closest(".js-shopping-item");
//       var item = {
//         id: element.attr("id"),
//         checked: !JSON.parse(element.attr("data-checked")),
//         name: element.find(".js-shopping-item-name").text()
//       };
//       updateShoppingListitem(item);
//     });
//   }

// -----
//Deletes the product from the product list

function deleteOneProduct(productID){
    console.log(`Deleting product` + productID)
    $.ajax({
        url: PRODUCT_URL + "/" + productID,
        method: "DELETE",
        success: getAndDisplayProductList()
    })
}

function handleDeleteProduct(){
    $('.js-product-table').on('click', '.js-dlt-btn', function(event){
        event.preventDefault();
        deleteOneProduct($(event.currentTarget).closest('.js-product-data').attr('id'));
    })
}

$(handleDeleteProduct());





