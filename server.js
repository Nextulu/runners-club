const express = require("express")
const app = express()

app.use(express.static("public"))

app.listen(process.env.PORT || 1337, () => console.log("Server is running!"))