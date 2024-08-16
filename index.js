import express from 'express';
import bodyParser from 'body-parser';
import fs from "fs";

const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync("Table_Input.csv", "utf8")

let rows = data.split("\n");

// should return ['Index #' ,'Value']
const getAttribute = () => {
    const result = rows[0].split(',')
    return [result[0],result[1].trimEnd()]
}

// return data from a1 to a20
// ['A1', 20]
const getRowData = () => {
    let rowData = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        rowData.push([row[0], parseInt(row[1].trimEnd())])
    }
    return rowData;
}

const CSVtoObject = () => {
    const attributes = getAttribute(data);
    const rowData = getRowData();

    let rowsObj = [];
    for (let i = 0; i < rowData.length; i++) {

        let rowObj = {};

        for (let j=0; j < rowData[i].length; j++) {
            rowObj[attributes[j]] = rowData[i][j];
        }

        rowsObj.push(rowObj)
    }
    return rowsObj
}

let newData = CSVtoObject()
let header = getAttribute()

app.get("/", (req, res) => {
    res.render('index.ejs', { data: newData, head: header })
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
})
