const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const baseUrl = 'https://v2cdn.velog.io/graphql';
const app = express();

let totalViews = 0;

app.get('/getTotalViews', async (req, res) => {
    try {
        const username = process.env.USER_NAME;
        const accessToken = process.env.ACCESS_TOKEN;
        const refreshToken = process.env.REFRESH_TOKEN;
        
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
                username: username,
                limit: 100,
                cursor: '',
            }
        })

        const posts = response.data.data.posts;
        const postIdList = posts.map((post) => post.id);

        for(const postId of postIdList) {
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
                      post_id: postId
                  }
                }, {
                  headers: {
                      Cookie: `refresh_token=${refreshToken}; access_token=${accessToken}`,
                  }
                });
                const views = response.data.data.getStats.total;
                totalViews += views;          
              } catch(error) {
                  console.error(error);
              }
        }
        res.json({totalViews: totalViews});
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})