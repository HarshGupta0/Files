const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the static folder (for serving static files like CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the home page
app.get('/', function (req, res) {
    // Read files in the 'files' directory
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            console.error("Error reading the directory:", err);
            return res.status(500).send("Error reading the directory");
        }
        
        // Render the index.ejs file with the list of files
        res.render("index", { files: files });
    });
});

app.get('/file/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).send("Error reading the file");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/edit', function(req, res) {
    console.log(req.body);
    const previousName = req.body.previousName;
    const newName = req.body.newName;
    
    fs.rename(`./files/${previousName}`, `./files/${newName}`, function(err) {
        if (err) {
            console.error("Error renaming the file:", err);
            return res.status(500).send("Error renaming the file");
        }
        res.redirect('/');  // Use res.redirect() to redirect to the home page
    });
});

// Handle form submission to create a new task
app.post('/create', function (req, res) {
    const title = req.body.title.split(' ').join('');
    const filePath = `./files/${title}.txt`; // Add a forward slash and extension

    // Write the task details to a new file in the 'files' directory
    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error writing the file:", err);
            return res.status(500).send("Error creating the file");
        }
        
        // Redirect back to the home page after file creation
        res.redirect("/");
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
