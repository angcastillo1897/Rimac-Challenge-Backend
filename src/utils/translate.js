const AWS = require("aws-sdk");
const translate = new AWS.Translate();
exports.translateText = async (text) => {
    const transformText = text.split('_').join(' ');
    const params = {
        Text: transformText,
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'es'
    };

    try {
        const data = await translate.translateText(params).promise();
        return data.TranslatedText.split(' ').join('_');
    } catch (error) {
        console.error('Error al traducir el texto:', error);
        throw error;
    }
};