const fs = require("fs").promises;

exports.handler = async (event) => {
    try {
        // Verifica se o método da solicitação é POST
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Método não permitido" }),
            };
        }

        // Pega o nome e conteúdo do documento a partir da solicitação
        const { name, content } = JSON.parse(event.body);

        if (!name || !content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Nome e conteúdo são obrigatórios" }),
            };
        }

        // Salva o conteúdo em um arquivo dentro da pasta `data`
        await fs.writeFile(`./data/${name}.txt`, content);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Documento salvo com sucesso!" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao salvar o documento", error }),
        };
    }
};
