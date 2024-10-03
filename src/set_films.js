const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const { translateText } = require("./utils/translate");

exports.setFilms = async (event) => {

    try {

        const response = await fetch('https://swapi.py4e.com/api/films/?format=json')
        const data = await response.json()
        let filmsList = data.results

        filmsList = filmsList.map(film => {
            film.created_at = new Date().toISOString()
            delete film.url
            delete film.created
            delete film.edited
            return film
        })

        const listObjectsTranslated = await Promise.all(
            filmsList.map(async film => {
                const entriesTranslated = await Promise.all(
                    Object.entries(film).map(async ([key, value]) => {
                        const keyTranslated = await translateText(key);
                        return [keyTranslated, value];
                    })
                );
                return Object.fromEntries(entriesTranslated);
            })
        );

        const dynamodb = new AWS.DynamoDB.DocumentClient()

        await Promise.all(listObjectsTranslated.map((film) => {
            film.id = uuidv4()
            return dynamodb.put({
                TableName: 'rimac-crud-filmTable-dev',
                Item: film,
            }).promise();
        }));

        return {
            statusCode: 200,
            body: JSON.stringify("Creado con exito"),
        }
    } catch (error) {

        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}