'use strict'

const SELLER_URL = '/api/users/seller'
const AUTH_URL = '/api/auth/login';

// User registration
function handleSellerRegistration(){
    $('.sign-up-form').submit(function(e){
        e.preventDefault();
        addSellerAjax({
            userName: $(e.currentTarget).find('#userName').val(),
            password: $(e.currentTarget).find('#password').val(),
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

$(handleSellerRegistration());

// User Authentication for login
function handleUserAuthentication(){
    $('.js-authentication-form').submit(function(event) {
        event.preventDefault();
        authenticateUser({
            userName: $(event.currentTarget).find('#username').val(),
            password: $(event.currentTarget).find('#password').val()
        });
    });
};

function authenticateUser(user){
    console.log('authenticating user');
    $.ajax({
        method: 'POST',
        url: AUTH_URL,
        data: JSON.stringify(user),
        success: function(data) {
            console.log('User successfully logged in');
            window.location.assign('http://localhost:8080/seller')
        },
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(handleUserAuthentication());