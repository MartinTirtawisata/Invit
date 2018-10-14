'use strict';
const PRODUCT_URL = '/api/products'
const SELLER_URL = '/api/sellers'

// GET Product
function getAndDisplayProductList(){
    $.getJSON(PRODUCT_URL, function(product_data){
        let productData = product_data.map((d, index) => {
            $('.product-qty').text(index + 1)
            return `<tr class="js-product-data" id=${d._id}>
            <td class="product-index">${index + 1}</td>
            <td class="js-product-name product-name">${d.product_name}</td>
            <td class="product-desc">${d.product_desc}</td>
            <td><span class="dollar-sign">$</span><span class="product-price">${d.price}</span></td>
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
        seller_data.map(s => {
            $('.js-seller-name').html(`${s.firstName} ${s.lastName}`)
            $('.js-seller-username').html(`${s.userName}`)
        });
    });
};

$(getAndDisplayProductList());
$(getAndDisplaySeller());

// -----
// POST Product

$('#add-modal-btn').on('click', function(){
    $('#add-product-modal').css('display','block');
    $('#add-product-modal').prop('hidden','false');
});

$('.close-btn').on('click', function(){
    $('#add-product-modal').css('display','none');
    $('#add-product-modal').prop('hidden','true');
})

function addProducts(product){
    $.ajax({
        method: 'POST',
        url: PRODUCT_URL,
        data: JSON.stringify(product),
        success: function(data) {
            getAndDisplayProductList()
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function handleAddProduct(seller_id){
    $('.js-add-product-form').submit(function(e){
        e.preventDefault();   
        addProducts({
            seller: seller_id,
            product_name: $('.js-add-product-form').find('#productName').val(),
            product_desc: $('.js-add-product-form').find('#productDesc').val(),
            price: $('.js-add-product-form').find('#productPrice').val()
        });
        console.log(seller_id)
        console.log($('.js-add-product-form').find('#productName').val())
        console.log($('.js-add-product-form').find('#productDesc').val())
        console.log($('.js-add-product-form').find('#productPrice').val()) 
        
        
        
        
        
        $(e.currentTarget).find('#productName').val('')
        $(e.currentTarget).find('#productDesc').val('')
        $(e.currentTarget).find('#productPrice').val('')
        $('#add-product-modal').css('display','none');
        $('#add-product-modal').prop('hidden','true');
    })
}

$.getJSON(SELLER_URL, function(seller_data){
    let seller_id = seller_data[0]._id
    $(handleAddProduct(seller_id))
});





// -----
// UPDATE Product

$('.js-product-table').on('click','.js-edit-btn', function(){
    $('#update-product-modal').css('display','block');
    $('#update-product-modal').prop('hidden','false');
});

$('.close-btn').on('click', function(){
    $('#update-product-modal').css('display','none');
    $('#add-product-modal').prop('hidden','true');
})

$('.js-update-product-form').submit(function(e) {
    e.preventDefault();
    $('#update-product-modal').css('display','none');
    $('#add-product-modal').prop('hidden','true');
})

//Issue - Calls handleProductUpdate everytime when clicking
function getProductId(){
    $('.js-product-table-body').on('click', '.js-edit-btn', function(e){
        e.preventDefault();
        console.log($(e.currentTarget))
        console.log($(e.currentTarget).closest('tr').attr('id'));
        console.log($(e.currentTarget).closest('tr').find('td.product-name').text());
        console.log($(e.currentTarget).closest('tr').find('td.product-desc').text());
        console.log($(e.currentTarget).closest('tr').find('span.product-price').text());

        let productID = $(e.currentTarget).closest('tr').attr('id')
        let productName = $(e.currentTarget).closest('tr').find('td.product-name').text();
        let productDesc = $(e.currentTarget).closest('tr').find('td.product-desc').text();
        let productPrice = $(e.currentTarget).closest('tr').find('span.product-price').text();

        $('.product-id').text(`${productID}`);
        $('#update-product-name').val(productName);
        $('#update-product-desc').val(productDesc); 
        $('#update-product-price').val(productPrice);
    })
}

function handleProductUpdate(){
    $('.js-update-product-form').submit(function(e){
        e.preventDefault();
        updateProductData({
            _id: $(e.currentTarget).find('.product-id').text(),
            product_name: $(e.currentTarget).find('#update-product-name').val(),
            product_desc: $(e.currentTarget).find('#update-product-desc').val(),
            price: $(e.currentTarget).find('#update-product-price').val()
        });
    });
}

function updateProductData(product){
    console.log(JSON.stringify(product))
    $.ajax({
        method: 'PUT',
        url: PRODUCT_URL + "/" + product._id,
        data: JSON.stringify(product),
        success: getAndDisplayProductList,
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(getProductId());
$(handleProductUpdate());

// -----
//DELETE Product

function deleteOneProduct(productID){
    $.ajax({
        url: PRODUCT_URL + "/" + productID,
        method: "DELETE",
        success: getAndDisplayProductList
    })
}

$('.js-product-table').on('click', '.js-dlt-btn', function(event){
    event.preventDefault();
    // add javascript pop up if yes
    deleteOneProduct($(event.currentTarget).closest('.js-product-data').attr('id'));
})




// Filter Product Name
$('#search').on('keyup', function(){
    let value = $(this).val().toLowerCase();
    $('#product-table-body tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});








