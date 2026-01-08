import express, { Application } from 'express';
import { postRouter } from './modules/post/post.route';


const app: Application = express();
app.use(express.json())



app.use("/posts", postRouter)


app.get("/", (req, res) => {
    res.send('hello world')
})

export default app;