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
            <td id="product-id">${index + 1}</td>
            <td class="js-product-name" id="product-name">${d.product_name}</td>
            <td id="product-desc">${d.product_desc}</td>
            <td id="product-price">${d.price}</td>
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
        console.log(seller_data)
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

$('.js-add-product-form').submit(function(e) {
    e.preventDefault();
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
    $('.js-add-product-form').submit(function(e){
        e.preventDefault();
        console.log('handling add product')
        addProducts({
            seller: '5bb23daaeca5741b3a97d49a',
            product_name: $(e.currentTarget).find('#productName').val(),
            product_desc: $(e.currentTarget).find('#productDesc').val(),
            price: $(e.currentTarget).find('#productPrice').val()
        })
        $(e.currentTarget).find('#productName').val('')
        $(e.currentTarget).find('#productDesc').val('')
        $(e.currentTarget).find('#productPrice').val('')
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

$('.js-update-product-form').submit(function(e) {
    e.preventDefault();
    $('#update-product-modal').css('display','none');
})

function getProductId(){
    $('.js-product-table').on('click', '.js-edit-btn', function(e){
        e.preventDefault();
        let productID = $(e.currentTarget).closest('tr').find('td#product-id').text();
        console.log(productID);
        let productName = $(e.currentTarget).closest('tr').find('td#product-name').text();
        console.log(productName);
        let productDesc = $(e.currentTarget).closest('tr').find('td#product-desc').text();
        console.log(productDesc);
        let productPrice = $(e.currentTarget).closest('tr').find('td#product-price').text();
        console.log(productPrice);

        $('.update-legend').text(`Updating Product ID: ${productID}`);
        $('#update-product-name').val(productName);
        $('#update-product-desc').val(productDesc); 
        $('#update-product-price').val(productPrice);
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
            product_name: $(e.currentTarget).find('#update-product-name').val(),
            product_desc: $(e.currentTarget).find('#update-product-desc').val(),
            price: $(e.currentTarget).find('#update-product-price').val()
        });
        $(e.currentTarget).find('#update-product-name').val('')
        $(e.currentTarget).find('#update-product-desc').val('')
        $(e.currentTarget).find('#update-product-price').val('')
    });
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
$('#search').on('keyup', function(){
    let value = $(this).val().toLowerCase();
    $('#product-table-body tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});







