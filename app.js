const express = require("express");
const {randomUUID} = require("crypto");
const fs = require("fs");

const app = express();

app.use(express.json());

let products = []; 

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err)
    }else{
        products = JSON.parse(data)
    }
})

//POST => Inserir um dado
//GET => Buscar um/mais dados
//PUT => Alterar um dado
//DELETE => Remover um dado

//Informações vindo pelo:
//Body => sempre que eu quiser enviar dados para minha aplicação
// Params => Parametros de rota, /product/id
// Query => fazem parte dos parametros mas não é obrigatório /product?id=18651561&value=168548

//criar um produto
app.post("/products", (request, response) => {
    //nome e preço => name e price
    const { name,price } = request.body;

    const product = {
        name,
        price,
        id: randomUUID(),
    };

    products.push(product);

    productFile()

    return response.json(product)
});

//buscar os produtos
app.get("/products", (request, response) => {
    return response.json(products)
});

//buscar os produtos por ID
app.get("/products/:id", (request, response) => {
    const {id } = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product)
})

//alterar um produto
app.put("/products/:id", (request, response) => {
    const {id } = request.params;
    const { name,price } = request.body;

    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        //... pega todas as informações menos os que forma informados em seguida
        ...products[productIndex],
        name,
        price
    }

    productFile()

    return response.json({message: "Produto alterado com sucesso"})
});


app.delete("/products/:id", (request, response) => {
    const { id } = request.params;

    const productIndex = products.findIndex(product => product.id === id)
    
    products.splice(productIndex, 1)

    productFile()

    return response.json({ message: "Produto removido com sucesso!"})
});


app.listen(4002, () => console.log("Servidor rodando na porta 4002"));

function productFile(){
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err){
            console.log(err)
        }else{
            console.log("Produto inserido")
        }
    })
}