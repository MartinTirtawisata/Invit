let MOCK_PAYMENT_DATA = {
    "product": [
        {
            "product_id": 111111,
            "product_name": "Bagpack",
            "price": 50,
            "quantity": 2
        },
        {
            "product_id": 222222,
            "product_name": "Yoghurt",
            "price": 40,
            "quantity": 3
        },
        {
            "product_id": 333333,
            "product_name": "iPhone",
            "price": 30,
            "quantity": 1
        },
    ]
}

function getProductData(callback){
    setTimeout(function(){
        callback(MOCK_PAYMENT_DATA)
    }, 100);
}

function displayProduct(data){
    for (index in data.product){
        $('.js-payment-result').append(`<p>${data.product[index].product_name}</p>
        <p>${data.product[index].price}</p>
        <p>${data.product[index].quantity}</p><br>
        `)
    }
    
}

function getProductAndDisplayData(){
    getProductData(displayProduct);
}

$(function(){
    getProductAndDisplayData();
})