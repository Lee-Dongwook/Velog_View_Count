const express = require('express');
const { graphqlHTTP }  = require('express-graphql');

const baseUrl = 'https://v2cdn.velog.io/graphql';

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphql: true,
    })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})