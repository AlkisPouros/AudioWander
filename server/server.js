const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

/*
app.get("/App.tsx", (req,res) => {
    res.json({"users": ["Alkis","Alex","and co"]});
})
*/

app.listen(5000, () => { console.log("Server started on port 5000") });