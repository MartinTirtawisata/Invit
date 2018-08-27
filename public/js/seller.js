let MOCK_SELLER_DATA = {
    "seller_id": "112233",
    "seller_name": {
        "firstName": "Moscato",
        "lastName": "Hokaido"
    },
    "username": "seller",
    "email": "seller@gmail.com",
    "password": "selleriscool",
    "products": "product_id"
}

function getSellerData(callback){
    setTimeout(function(){
        callback(MOCK_SELLER_DATA)
    }, 100)
}

function displaySellerData(data){
    $('.js-seller-result').append(`<p> ${data.seller_name.firstName} ${data.seller_name.lastName}</p><p> ${data.products}`)
}


function getAndDisplaySellerInfo(){
    getSellerData(displaySellerData)
}

$(getAndDisplaySellerInfo());