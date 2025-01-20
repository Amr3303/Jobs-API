require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// // swagger
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

// db
const connectDB = require("./db/connect");

// routes
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// middlewares
const authinticateUser = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 100, // 15 minutes
        max: 100,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
    res.send('<h1>jobs api page</h1><a href="/api-docs">Docmentation</a>');
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/jobs", authinticateUser, jobsRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
