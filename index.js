const cookieParser = require('cookie-parser')
const express  = require("express");
const app  = express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose")

//--------midlewares ROUTES--------//
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const postRoute = require("./routes/posts.js");
const categoryRoute = require("./routes/categories.js");
const tagsRoute = require("./routes/tags.js");
const clubRoute = require("./routes/club.js");
const countryRoute = require("./routes/country.js");
const LeagueRoute = require("./routes/league.js");
const path = require("path");
const PORT = process.env.PORT || 3030;

//hendlig file with muller
const multer = require("multer");
//mongoDb url 
dotenv.config();
//so the app can send json data
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

//connecting mongoDB
mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(console.log('connected')).catch((err)=> console.log(err));


//--------midlewares--------//
//cookiepar
app.use(cookieParser())
//creating auth users
app.use("/api/auth", authRoute);
//crud user
app.use("/api/users", userRoute);
//crud posts
app.use("/api/posts", postRoute);
//Category 
app.use("/api/categories", categoryRoute);
//tags 
app.use("/api/tags", tagsRoute);
//club 
app.use("/api/club", clubRoute);
//countries 
app.use("/api/country", countryRoute);
//league
app.use("/api/league", LeagueRoute);



//files storage
// File storage
app.use('/images', express.static(path.join(__dirname, '/images')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.array('images', 5), (req, res) => {
  res.status(200).json('Images uploaded successfully!');
});


//end of files storage

app.listen(PORT, () => {
  console.log("Backend is running.");
});