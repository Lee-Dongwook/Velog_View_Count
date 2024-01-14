const express = require('express');
const axios = require('axios');
const { graphqlHTTP }  = require('express-graphql');

const baseUrl = 'https://v2cdn.velog.io/graphql';

const app = express();

app.get('/getPosts', async (req, res) => {
    try {
        const response = await axios.post(baseUrl, {
            query: `
            query Posts($cursor: ID, $username: String, $temp_only: Boolean, $tag: String, $limit: Int) {
                posts(cursor: $cursor, username: $username, temp_only: $temp_only, tag: $tag, limit: $limit) {
                  id
                  title
                }
              }
            `,
            variables: {
                username: 'dlehddnr99',
                limit: 100,
                cursor: '',
            }
        })

        const posts = response.data.data.posts;
        console.log(posts);
        res.json(posts);

    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// app.use(
//     '/graphql',
//     graphqlHTTP({
//         schema: schema,
//         rootValue: root,
//         graphql: true,
//     })
// );

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})