var express = require('express')
var fs = require("fs")
var execFile=require('child_process').execFile
var multer  = require('multer')

var app = express() 
app.use(express.static('public'))
app.use(multer({ dest: 'tmp/'}).array('image'))

var t1
//接受上传图片模块
app.post('/upload', function (req, res) {
  t1=Date.now()
  console.log('接收到上传图片的时间:0s') 
  // console.log(req.files[0])  // 上传的文件信息
  upload_filename=req.files[0].originalname
  hattype=req.query.hattype
  console.log('Upload_filename:'+upload_filename)
  console.log('Hattype:'+hattype)

  var des_file = "upload_files/" + req.files[0].originalname
  fs.readFile( req.files[0].path, function (err, data) {
      fs.writeFile(des_file, data, function (err) {
       if( err ){
            console.log( err )
       }
     })
  })
  console.log('开始调用图像处理模块的时间:'+(Date.now()-t1)/1000+'s')
  execFile('python', ['imgprocess_module/AddHat.py',upload_filename,hattype],function(err,stdout,stderr){
    if(err){
      console.log(stderr)
    }
    else{
      console.log(Date.now()-t1)
    	console.log(stdout)
    	flag='No'
    	if(stdout[stdout.length-2]==1){
    		flag='Yes'
    	}
    	response = {
    	message:'File uploaded successfully', 
        filename:req.files[0].originalname,
        facefound:flag
    };
    	res.send(JSON.stringify(response))
      console.log('结束调用图像处理模块的时间:'+(Date.now()-t1)/1000+'s')
    }
  })
  
})


//下载图片模块
app.get('/download',function(req,res){
  filename=req.query.filename
	var file="download_files/"+filename
	res.download(file)
  console.log('接收到下载请求的时间:'+Date.now()-t1+'s')
})


//Request测试模块
app.get('/',function(req,res){
	res.send("hello")
})


//设置监听端口 
var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})


