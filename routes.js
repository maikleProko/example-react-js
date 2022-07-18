const express = require('express');
const routes = express.Router();
const fs = require('fs');


//Get all users
routes.get('/users', (request, response) =>{
    fs.readFile("./public/json/users.json", (err, data) =>{
        let users = JSON.parse(data);
        response.status(200).send(users);
    });
});

//Get user by name
routes.get('/users/:name', (request, response)=>{
    fs.readFile("./public/json/users.json", (err, data) =>{
        let users = JSON.parse(data);

        const name = request.params.name;
        let foundUser = users.find(user => user.name === name);

        if(foundUser){
            response.status(200).send(foundUser);
        }else{
            response.sendStatus(404);
        }
    });

});



//Get all sales
routes.get('/sales', (request, response) =>{
    fs.readFile("./public/json/sales.json", (err, data) =>{
        let sales = JSON.parse(data);
        response.status(200).send(sales);
    });
});

//Get all sales for user
routes.get('/sales/:name', (request, response)=>{
    fs.readFile("./public/json/sales.json", (err, data) =>{
        let sales = JSON.parse(data);
        const name = request.params.name;
        let salesForUser = sales.filter((sale) => sale.sellerName === name);

        response.status(200).send(salesForUser);
    });
});

module.exports = routes;
