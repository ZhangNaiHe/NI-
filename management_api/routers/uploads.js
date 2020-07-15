const router = require('express').Router()
const multer = require('multer')
const {server,db} = require('../config')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        let newName = Date.now() + '.' + file.originalname.substr(file.originalname.lastIndexOf('.') + 1)
        cb(null, newName)
    }
})
const upload = multer({
    storage,
    limits: {
        fileSize: 1024*1024*4
    },
    fileFilter: (req, file, cb) => {
        if(['image/png','image/jpeg', 'image/jpg', 'image/gif'].indexOf(file.mimetype) !== -1)
        cb(null, true)
        else {
            cb(new Error('不允许上传的类型'))
        }
    }
})

router.post('/upload',upload.single('image'),(req, res) => {
    res.json({
        "data": {
            "tmp_path": String("uploads/" + req.file.filename),
            "url": String('http://' +db.host + ':'+ server.port + "uploads/" + req.file.filename)
        },
        "meta": {
            "msg": "上传成功",
            "status": 200
        }
    })
})
module.exports = router