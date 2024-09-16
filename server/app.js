const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user-route");
const adminRoute = require("./routes/admin-route");

const app = express();




const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api',userRoute);
app.use('/api',adminRoute);

app.listen(PORT,()=>{
       console.log(`server listning on ${PORT}`);
},)