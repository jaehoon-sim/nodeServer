const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");
const PORT = 3001;
const app = express();

app.use(cors());

const getRidi = async (cate, id) => {
    try {
        // return await axios.get(`https://ridibooks.com/category/${cate}/${id}/`);
        return await axios.get(
            // `https://page.kakao.com/menu/${cate}/screen/${id}`
            `https://page.kakao.com/landing/ranking/${cate}/${id}?ranking_type=daily`
        ); // 11 webnovel, 117 romance fantasy
        // 해당 사이트 html 태그 가져오기
    } catch (error) {
        console.error(error);
    }
};

app.get("/kakao/:cate/:id", (req, res) => {
    getRidi(req.params.cate, req.params.id)
        .then((html) => {
            const $ = cheerio.load(html.data);
            let data = $("#__NEXT_DATA__").text();
            let resultArr = JSON.parse(data);
            resultArr =
                resultArr.props.pageProps.initialState.json.pagewebLayout
                    .entities.items;
            console.log(resultArr);
            const booksArray = [];
            console.log(booksArray);
            
            resultArr.map((book, index) => {
                const titles = book.book.title;
                const thumbs = book.book.cover.small;
                const urls = "https://ridibooks.com/books/" + book.book.bookId;
                const booksData = {
                    index: index + 1,
                    title: titles,
                    thumbs: thumbs,
                    url: urls,
                };
                booksArray.push(booksData);
            });

            return booksArray;
        })
        .then((data) => res.send(data));
});

app.listen(PORT, () =>
    console.log(`Crawling api listening at http://localhost:${PORT}`)
);
