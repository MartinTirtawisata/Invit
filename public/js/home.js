let MOCK_ITEM_COLLECTION = {
    "item_collection": [
        {
            "id": "111111",
            "seller_name": "Martin",
            "product_name": "name of the item",
            "img": "an image",
            "desc": "description of the item",
            "price": 50,
            "publishedAt" : 123434
        },
        {
            "id": "222222",
            "seller_name": "Levina",
            "product_name": "name of the item 2",
            "img": "an image 2",
            "desc": "description of the item 2",
            "publishedAt" : 123234
        },
        {
            "id": "333333",
            "seller_name": "Ipi",
            "product_name": "name of the item 3",
            "img": "an image 3",
            "desc": "description of the item 3",
            "publishedAt" : 1234434
        },
    ]
}

function getItemCollection(callback) {
    setTimeout(function(){
        callback(MOCK_ITEM_COLLECTION)
    }, 100);
}

function displayItemCollection(data){
    for (index in data.item_collection){
        $('body').append(`<p> ${data.item_collection[index].product_name}</p><p>${data.item_collection[index].desc}</p><br> `)
    }
}

function getItemCollectionAndDisplayItem(){
    getItemCollection(displayItemCollection);
}

$(function(){
    getItemCollectionAndDisplayItem();
})

