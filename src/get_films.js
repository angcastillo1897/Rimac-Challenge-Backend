const AWS = require("aws-sdk");

exports.getFilms = async (event) => {
    try {

        const dynamodb = new AWS.DynamoDB.DocumentClient()

        const result = await dynamodb.scan({
            TableName: 'rimac-crud-filmTable-dev',
        }).promise()

        const films = result.Items

        return {
            statusCode: 200,
            body: JSON.stringify(films)
        }
    } catch (error) {

        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}