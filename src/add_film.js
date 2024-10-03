const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

exports.addFilm = async (event) => {

    try {

        const { título, director, fecha_de_lanzamiento, caracteres, planetas, rastreo_de_aperturas, identificador_de_episodio, productora, naves_estelares, especie, vehículos } = JSON.parse(event.body);

        const creado_en = new Date().toISOString();
        const id = uuidv4();

        const dynamodb = new AWS.DynamoDB.DocumentClient()

        const newFilm = {
            id,
            título,
            director,
            fecha_de_lanzamiento,
            caracteres,
            planetas,
            rastreo_de_aperturas,
            identificador_de_episodio,
            productora,
            naves_estelares,
            especie,
            vehículos,
            creado_en
        }
        console.log(newFilm)
        await dynamodb.put({
            TableName: 'rimac-crud-filmTable-dev',
            Item: newFilm
        }).promise()

        return {
            statusCode: 200,
            body: JSON.stringify(newFilm)
        }
    } catch (error) {

        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}