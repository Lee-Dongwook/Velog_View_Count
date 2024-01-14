const express = require('express');
const axios = require('axios');

const baseUrl = 'https://v2cdn.velog.io/graphql';

const app = express();

app.get('/getPostIdList', async (req, res) => {
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
        const postIdList = posts.map((post) => post.id);

        res.json(postIdList);

    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

app.get('/getStatusOfCertainPost', async (req, res) => {
    try {
      const response = await axios.post(baseUrl, {
        query: `
        query GetStats($post_id: ID!) {
            getStats(post_id: $post_id) {
                total
                count_by_day {
                    count
                    day
                }
            }
        }
        `,
        variables: {
            post_id: "7f3fd348-8c4d-405e-a701-818586c92acf"
        }
      })

      console.log(response.data);

    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})