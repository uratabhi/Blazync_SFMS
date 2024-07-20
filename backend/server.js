const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
require('dotenv').config();

connectDB();


const app = express();
const port = process.env.PORT || 4000


app.use(cors());


app.use(express.json()); // for accepting json data; 


app.get('/', (req, res)=>{
     res.send('Api is running');
})

app.use('/api/user', userRoutes);
app.use('/api/student', studentRoutes);
app.use(notFound);
app.use(errorHandler);


app.listen(port, ()=>{
     console.log(`server listening on port ${port}`);
})

