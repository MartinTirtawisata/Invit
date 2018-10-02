'use strict';
const PRODUCT_URL = '/api/products'
const SELLER_URL = '/api/sellers'

// GET Product
function getAndDisplayProductList(){
    console.log('retrieving product data API')
    $.getJSON(PRODUCT_URL, function (product_data){
        console.log("Rendering product data")
        let productData = product_data.map((d, index) => {
            console.log(d)
            return `<tr class="js-product-data" id=${d._id}>
            <td>${index + 1}</td>
            <td class="js-product-name">${d.product_name}</td>
            <td>${d.product_desc}</td>
            <td>${d.price}</td>
            <td>
                <button class="js-edit-btn edit-btn"><span class="edit-text">Edit</span></button>
                <button class="js-dlt-btn delete-btn"><span>Delete</span></button>    
            </td>
            </tr>`;
        });
        $('.js-product-table-body').html(productData)
    })    
}


//-----
//GET Seller
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
// POST Product

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
            seller: '5bb23daaeca5741b3a97d49a',
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
// UPDATE Product

$('.js-product-table').on('click','.js-edit-btn', function(){
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

// -----
//DELETE Product

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

// Filter Product Name







