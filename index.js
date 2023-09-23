const cookieParser = require('cookie-parser')
const express  = require("express");
const app  = express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT ;
//const port = process.env.PORT || 5000;


//--------midlewares ROUTES--------//
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const postRoute = require("./routes/posts.js");
const categoryRoute = require("./routes/categories.js");
const tagsRoute = require("./routes/tags.js");
const clubRoute = require("./routes/club.js");
const countryRoute = require("./routes/country.js");
const LeagueRoute = require("./routes/league.js");
const commentsRouter = require("./routes/comments.js");
const playerRouter = require("./routes/player.js");


const path = require("path");


//hendlig file with muller
const multer = require("multer");
//mongoDb url 
dotenv.config();
//so the app can send json data


app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

// Enable CORS for all routes 
// Define an array of allowed origins


// Configure CORS to allow requests from allowed origins
const corsOptions = {
  origin: [
    '*',
    'https://admino-beta.vercel.app',
    'https://client-ts.vercel.app'
  ],
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));;

//connecting mongoDB

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

//--------midlewares--------//
// Enable CORS for all routes
/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});*/
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
//players
app.use("/api/player", playerRouter);


// Import and use the comments router
app.use("/api/comments", commentsRouter);


//store images localy
app.use("/images", express.static(path.join(__dirname, "/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});




//end of files storage

//api middleware
app.use(
  '/api/football',
  createProxyMiddleware({
    target: 'https://api.sportmonks.com/v3',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/api/football': '/football',
    },
  })
);



app.listen(port, () => {
  console.log(`Backend is running on port ${port}.`);
});
