'use strict'

const SELLER_URL = '/api/sellers'

function handleSellerSignup(){
    $('.sign-up-form').submit(function(e){
        e.preventDefault();
        addSellerAjax({
            userName: $(e.currentTarget).find('#userName').val(),
            password: $(e.currentTarget).find('#password').val(),
            email: $(e.currentTarget).find('#email').val(),
            firstName: $(e.currentTarget).find('#firstName').val(),
            lastName: $(e.currentTarget).find('#lastName').val()
        })
    })
}

function addSellerAjax(seller){
    console.log('adding the user')
    $.ajax({
        method: 'POST',
        url: SELLER_URL,
        data: JSON.stringify(seller),
        success: function(data){
            console.log('success')
            // Edit redirection later. 
            window.location.assign('http://localhost:8080/seller')
            
        },
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(handleSellerSignup());