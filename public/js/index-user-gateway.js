'use strict'

const USER_URL = '/api/users/register'
const AUTH_URL = '/api/auth/login';

// User registration handler
function handleUserRegistration(){
    $('.sign-up-form').submit(function(e){
        e.preventDefault();
        registerUserAjax({
            userName: $(e.currentTarget).find('#userName').val(),
            password: $(e.currentTarget).find('#password').val(),
            firstName: $(e.currentTarget).find('#firstName').val(),
            lastName: $(e.currentTarget).find('#lastName').val()
        })
    })
}

function registerUserAjax(user){
    $.ajax({
        method: 'POST',
        url: USER_URL,
        data: JSON.stringify(user),
        success: function(data){
            window.location.assign('/user')
        },
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(handleUserRegistration());

// User Login Authentication Handle
function handleUserAuthentication(){
    $('.js-authentication-form').submit(function(event) {
        event.preventDefault();
        authenticateUserAjax({
            userName: $(event.currentTarget).find('#username').val(),
            password: $(event.currentTarget).find('#password').val()
        });
    });
};

function authenticateUserAjax(user){
    console.log('authenticating user');
    $.ajax({
        method: 'POST',
        url: AUTH_URL,
        data: JSON.stringify(user),
        success: function(data) {
            window.location.assign('/user')
        },
        dataType: 'json',
        contentType: 'application/json'
    })
}

$(handleUserAuthentication());