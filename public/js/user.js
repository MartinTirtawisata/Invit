'use strict';
const PRODUCT_URL = '/api/products'
const SELLER_URL = '/api/sellers'

// GET Product
function getAndDisplayProductList(){
    $.getJSON(PRODUCT_URL, function(product_data){
        let productData = product_data.map((d, index) => {
            $('.product-qty').text(index + 1)
            return `<tr class="js-product-data" id=${d._id}>
            <td class="product-id">${index + 1}</td>
            <td class="js-product-name product-name">${d.product_name}</td>
            <td class="product-desc">${d.product_desc}</td>
            <td class="product-price"><span>$</span>${d.price}</td>
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

function getProductId(){
    $('.js-product-table').on('click', '.js-edit-btn', function(e){
        e.preventDefault();
        let productID = $(e.currentTarget).closest('tr').find('td.product-id').text();
        let productName = $(e.currentTarget).closest('tr').find('td.product-name').text();
        let productDesc = $(e.currentTarget).closest('tr').find('td.product-desc').text();
        let productPrice = $(e.currentTarget).closest('tr').find('td.product-price').text();

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
        success: getAndDisplayProductList,
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(getProductId());

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








