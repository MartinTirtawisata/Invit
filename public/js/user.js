'use strict';
const PRODUCT_URL = '/api/products'
const USER_URL = '/api/users'

// Display Products
function getAndDisplayProductList(){
    $.getJSON(PRODUCT_URL, function(product_data){
        let productData = product_data.map((d, index) => {
            $('.product-qty').text(index + 1)
            return `<tr class="js-product-data" id=${d._id}>
            <td class="product-index">${index + 1}</td>
            <td class="js-product-name product-name">${d.product_name}</td>
            <td class="product-desc">${d.product_desc}</td>
            <td><span class="dollar-sign">$</span><span class="product-price">${d.price}</span></td>
            <td class="product-qty">${d.product_qty}</td>
            <td>
                <button class="js-edit-btn edit-btn"><span class="edit-text">Edit</span></button>
                <button class="js-dlt-btn delete-btn"><span>Delete</span></button>    
            </td>
            </tr>`;
        });
        $('.js-product-table-body').html(productData)
    });    
};

function getTotalValue(){
    $.getJSON(PRODUCT_URL, function(data) {
        let productData = data.map((d, index) => {
            for (let i=0; i < index+1; i++) {
                let price = d.price;
                let qty = d.product_qty;
                let total = price * qty;
                return total
            }
        })
        function totalSum(total, current) {
            return total + current
        } 
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $('.total-value').text(productData.reduce(totalSum));
        let val = parseInt($('.total-value').text());
        val = numberWithCommas(val);
        $('.total-value').text(val);
    })  
}



//-----
//Display username
function getAndDisplayUser(){
    $.getJSON(USER_URL, function(user_data) {
        user_data.map(s => {
            $('.js-user-name').html(`${s.firstName} ${s.lastName}`)
            $('.js-user-username').html(`${s.userName}`)
        });
    });
};

$(getAndDisplayProductList());
$(getAndDisplayUser());
$(getTotalValue());

// -----
// Creating new products

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
            getTotalValue()
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function handleAddProduct(user_id){
    $('.js-add-product-form').submit(function(e){
        e.preventDefault();   
        addProducts({
            user: user_id,
            product_name: $('.js-add-product-form').find('#productName').val(),
            product_desc: $('.js-add-product-form').find('#productDesc').val(),
            price: $('.js-add-product-form').find('#productPrice').val(),
            product_qty: $('.js-add-product-form').find('#productQty').val()
        });  
        $(e.currentTarget).find('#productName').val('')
        $(e.currentTarget).find('#productDesc').val('')
        $(e.currentTarget).find('#productPrice').val('')
        $(e.currentTarget).find('#productQty').val('')
        $('#add-product-modal').css('display','none');
        $('#add-product-modal').prop('hidden','true');
    })
}

$.getJSON(USER_URL, function(user_data){
    let user_id = user_data[0]._id
    $(handleAddProduct(user_id))
});
// -----
// Update Products

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
    $('.js-product-table-body').on('click', '.js-edit-btn', function(e){
        e.preventDefault();
        let productID = $(e.currentTarget).closest('tr').attr('id')
        let productName = $(e.currentTarget).closest('tr').find('td.product-name').text();
        let productDesc = $(e.currentTarget).closest('tr').find('td.product-desc').text();
        let productPrice = $(e.currentTarget).closest('tr').find('span.product-price').text();
        let productQty = $(e.currentTarget).closest('tr').find('td.product-qty').text();
        $('.product-id').text(`${productID}`);
        $('#update-product-name').val(productName);
        $('#update-product-desc').val(productDesc); 
        $('#update-product-price').val(productPrice);
        $('#update-product-qty').val(productQty);
    });
};

function handleProductUpdate(){
    $('.js-update-product-form').submit(function(e){
        e.preventDefault();
        updateProductData({
            _id: $(e.currentTarget).find('.product-id').text(),
            product_name: $(e.currentTarget).find('#update-product-name').val(),
            product_desc: $(e.currentTarget).find('#update-product-desc').val(),
            price: $(e.currentTarget).find('#update-product-price').val(),
            product_qty: $(e.currentTarget).find('#update-product-qty').val()
        });
    });
};

function updateProductData(product){
    $.ajax({
        method: 'PUT',
        url: PRODUCT_URL + "/" + product._id,
        data: JSON.stringify(product),
        success: function(data){
            getAndDisplayProductList()
            getTotalValue()   
        },
        dataType: 'json',
        contentType: 'application/json'
    });
};

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
    deleteOneProduct($(event.currentTarget).closest('.js-product-data').attr('id'));
})

// Search filter
$('#search').on('keyup', function(){
    let value = $(this).val().toLowerCase();
    $('#product-table-body tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});








