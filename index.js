const express = require("express");
// const cors = require("cors");
const firebase = require('firebase')
const handlebars = require('express-handlebars')
const path = require('path')
const app = express();
app.use(express.json());
// app.use(cors());
app.use(express.urlencoded({
  extended : true
}));
app.engine('hbs', handlebars.engine({
  extname:'.hbs'
}))
app.set('view engine', 'hbs')
app.set('views' , path.join(__dirname,'resources/views'));
const http = require("http").createServer(app);
  const firebaseConfig ={
    apiKey: "AIzaSyC0ALYEQcMqnXHT-gZyexMdX37HCPdfuAM",
    authDomain: "fpoly-friend.firebaseapp.com",
    databaseURL: "https://fpoly-friend-default-rtdb.firebaseio.com",
    projectId: "fpoly-friend",
    storageBucket: "fpoly-friend.appspot.com",
    messagingSenderId: "475753837744",
    appId: "1:475753837744:web:5887cf11dca611f1bf7775",
    measurementId: "G-MGVJ00L9LE"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database().ref("user_profile");
  const auth = firebase.auth();
// app.get("/", async (req, res) => {
//   const snapshot = await User.get();
//   const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   res.send(list);
// });
// app.get("/", async (req, res) => {
//    try {
//     let response = []
//     await db.collection('user_profile').get().then(querysnapshot=>{
//       let docs = querysnapshot.docs

//       for (let doc of docs){
//         response.push(doc.database())
//       }
//       return res.status(200).send(response)
//     }

//     )
//    } catch (error) {
//     return res.status(500).send(error)
//    }
//   });
app.get('/userall', async(req,res)=>{
  db.get().then((snapshot) => {
    if (snapshot.exists()) {
      // res.send(snapshot.val());
      const data = snapshot.val();
      res.render('userall',{ data})
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
})
app.get('/delete/:id', async(req,res)=>{
  let UserId = req.params.id
  await db.child(UserId).remove()
  res.redirect('/userall')
})
app.get('/', async(req,res)=>{
  res.render('login') 
})
app.get('/register', async(req,res)=>{
  res.render('register')
})
app.post('/register',async(req,res)=>{
  if(!req.body.email||!req.body.password){
    return res.status(422).message({
      email: "email is required",
      password:"password is required"
    })
  }
  auth.createUserWithEmailAndPassword(req.body.email , req.body.password)
  .then((data)=>{
    //alert("Thêm quản trị viên thành công")
    res.redirect('/userall')
  })
  .catch(function(error){
    let errorCode = error.code
    let errorMessage = error.message
    if(errorCode == "auth/weak-password"){
      return res.status(500).send({error : errorMessage})
    }else{
      return res.status(500).send({error : errorMessage})
    }
  })
})
app.post('/login', async(req,res)=>{
 if(!req.body.email || !req.body.password){
  return res.status(422).json({
    email :"Email is required",
    password:"password is required"
  })
 }
 auth.signInWithEmailAndPassword(req.body.email , req.body.password)
 .then((user)=>{
  res.redirect('/userall');
 }).catch (function(error){
  let errorCode = error.code;
  let errorMessage = error.message;
  if(errorCode ==="auth/wrong-password"){
    return res.status(500).json({error : errorMessage})
  }else{
return res.status(500).json({error :errorMessage})
  }
 })
}
)
// app.post('/verifyEmail' , async(req,res)=>{
app.post('/forgot')
const PORT = process.env.PORT||4000
app.listen(PORT,()=> console.log(`Sever running in `+PORT))