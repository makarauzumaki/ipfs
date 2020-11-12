const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs= require('fs');

const ipfs = new ipfsClient({host: '192.168.1.97', port: '5001', protocol: 'http'});
const app= express();

// var hash = require('hash');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/',(req,res)=>{
    res.render('home');
});

app.post('/upload',(req,res)=>{
    const f= req.files.file;
    const Name = req.files.file.name;
    const filePath ="files/"+ Name;

    f.mv(filePath,async(err)=>{

        if(err){
            console.log("error failed to download a file");
            return res.status(500).send(err);
        }

        const fileh = await addFile(Name,filePath);

        fs.unlink(filePath, (err)=>{
            if(err) console.log("error");
        });

        res.render('upload',{Name,fileh});
    });
});

const addFile= async(Name,filePath)=> {
    const file=fs.readFileSync(filePath);

    const fileAdded = await ipfs.add({path: Name, content: file});

    const fileHash = fileAdded[0].hash;

    return fileHash;
};

app.listen(3000,()=>{
    console.log("server is listen on Port 3000");
}); 