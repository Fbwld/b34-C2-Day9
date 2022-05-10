let blogs = [
  {
    project: 'Dumbways Mobile App - 2021',
    duration: '3',
    message: 'App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download.',
    image: 'april_2018-08-10-19-54-35-306.jpg',
    check_icon: { nodejs: 'on', reactjs: 'on', nextjs: 'on', typescript: 'on' }
  }
]

//pemanggilan package express
const express = require('express')
//menggunakan package express
const app = express()
//pemanggilan package hbs
const hbs = require('hbs')


// import dbpool
const db =require('./connection/db')
//import pg package
const dbnew = require('pg')

//setup connection pool
// const dbPool = {
//     database : 'db_project',
//     port :5432,
//     user:'postgres',
//     password:'nuraini16'
// }

// const db = new dbnew.Pool(dbPool) 
//atur template engine
  app.set('view engine','hbs')

//memngatur membuka css.image
app.use('/public',express.static(__dirname + '/public'))
app.use('/bootstrap-5.1.3-dist',express.static(__dirname + '/bootstrap-5.1.3-dist'))
app.use('/fontawesome',express.static(__dirname + '/fontawesome'))
app.use(express.urlencoded({extended:false}))
//helper baru untuk hbs
hbs.registerHelper('isTrue', function (kondisi, argument){
  return kondisi === argument
})

//request = client menuju server
//respons = server menuju client
app.get('/logo', function (req, res) {
  res.render('logo')
})
app.get('/home', function (req, res) {
  let query =`SELECT * FROM tb_project order by id desc`
  db.connect((err, client, done)=>{
    if (err) throw err

    client.query(query,(err,result)=>{
      done()

      let data = result.rows;
      data.map(project =>{
        let tekno = project.techno
        console.log(tekno)
        let datatekno = JSON.parse(tekno)
        let startdate = project.start_date
        let enddate = project.end_date
        const duration = getTime(startdate,enddate)
        // console.log(duration)
        project.duration = duration
        project.techno = datatekno
      })
        console.log(data)
      res.render('home', { project: data });

    })

  })
})
// app.get('/home', function (req, res) {
//   res.render('home',{blogs})
// })
app.get('/project', function (req, res) {
  res.render('form-project')
})
app.get('/contact', function (req, res) {
  res.render('form-blog')
})
app.get('/edit-project', function (req, res) {
  res.render('edit-project')
})
app.get('/project/:id', function (req, res) {
  let id = req.params.id
  res.render('blog-detail', {dataId:id})
})
app.get('/blog-detail/:id', function (req, res) {
  let id = req.params.id
  let project = blogs[id]
  console.log(project)
  res.render('blog-detail', {project:id,project})
})

app.get('/edit-project/:id', function (req, res) {
  let id = req.params.id
  let query =`SELECT * FROM tb_project where id=${id}`
  console.log('febi cantik')
  db.connect((err, client, done)=>{
    if (err) throw err

    client.query(query,(err,result)=>{
      done()

      let data = result.rows;
      data.map(project =>{
        let tekno = project.techno
        // console.log('febi cantik banget',tekno.nodejs)
        let datatekno = JSON.parse(tekno)
        let startdate = project.start_date
        let enddate = project.end_date
        const duration = getTime(startdate,enddate)

        startdate= new Date(project.start_date)
        enddate = new Date(project.end_date)
        let tidakBolehLebih = 10
        project.start_date = `${startdate.getFullYear()}-${(startdate.getMonth()+1<tidakBolehLebih)? `0${startdate.getMonth()+1}`:`${startdate.getMonth()+1}`}-${(startdate.getDay()<tidakBolehLebih)? `0${startdate.getDay()}`: `${startdate.getDay()}`}`
        project.end_date = `${enddate.getFullYear()}-${(enddate.getMonth()+1<tidakBolehLebih)? `0${enddate.getMonth()+1}`:`${enddate.getMonth()+1}`}-${(enddate.getDay()<tidakBolehLebih)? `0${enddate.getDay()}`: `${enddate.getDay()}`}`
        // console.log(duration)
        project.duration = duration
        project.techno = datatekno
      })
      console.log(data)
        console.log('febi cantik',data[0].techno.nodejs)
      res.render('edit-project', { project: data[0]});
    })

  })
})
function getTime(date1,date2){
  const dateone = new Date(date1)
  const datetwo = new Date(date2)
  const time = Math.abs(datetwo- dateone);
  const month = Math.ceil(time/(1000 * 60 * 60 * 24 * 30));
  return `${month}`
}
app.post('/project', function (req, res) {
  let project = req.body.project
  let startdate = req.body.start
  let enddate = req.body.end
  let message = req.body.message
  let nodejs = req.body.nodejs
  let reactjs = req.body.reactjs
  let nextjs = req.body.nextjs
  let typescript =req.body.typescript
  let image = req.body.image 

  let blog ={
    project,
    startdate,
    enddate,
    message,
    image,
    duration: getTime(startdate,enddate), 
    nodejs,
    reactjs,
    nextjs,
    typescript,
    
    check_icon:{
      nodejs,
      reactjs,
      nextjs,
      typescript,
    }
  }
  let tekno ={
    nodejs,
    reactjs,
    nextjs,
    typescript
  }
  let c2 = JSON.stringify(tekno)

  db.connect((err, client, done)=>{
    if (err) throw err
    let query =`insert into tb_project(project_name,start_date,end_date,message,techno,img) values ('${blog.project}','${blog.startdate}','${blog.enddate}','${blog.message}','${c2}','${blog.image}')` 
    client.query(query,(err,result)=>{
      done()
      if (err) throw err
      res.redirect('/home')
    })
  })

})
app.post('/edit-project/:id', function (req, res) {
  console.log('febi')
  let project = req.body.project
  let startdate = req.body.start
  let enddate = req.body.end
  let id = req.params.id
  let message = req.body.message
  let nodejs = req.body.nodejs
  let reactjs = req.body.reactjs
  let nextjs = req.body.nextjs
  let typescript =req.body.typescript
  let image = req.body.image 

  let blog ={
    project,
    startdate,
    enddate,
    message,
    image,
    duration: getTime(startdate,enddate), 
    nodejs,
    reactjs,
    nextjs,
    typescript,
    
    check_icon:{
      nodejs,
      reactjs,
      nextjs,
      typescript,
    }
  }
  let tekno ={
    nodejs,
    reactjs,
    nextjs,
    typescript
  }
  let c2 = JSON.stringify(tekno)

  db.connect((err, client,done)=>{
    if (err) throw err
    let query = `update tb_project set project_name='${project}',start_date='${startdate}',end_date='${enddate}',message='${message}',techno='${c2}',img='${image}' where  id='${id}'`
    
    client.query(query,(err,result)=>{
      done()
      if (err) throw err
      res.redirect('/home')
    })
  })
})
app.get('/delete-project/:id', function(req,res){
  let id = req.params.id
  db.connect((err, client,done)=>{
    if (err) throw err
    let query =`delete from tb_project where id=${id}`

    client.query (query,(err,result)=>{
      done()
      if (err) throw err
      res.redirect('/home')
    })
  })

})



//port adalah sebuah jalur
const port = 5000
app.listen(port,function(){
    console.log(`Server running on port : ${port}`);
})