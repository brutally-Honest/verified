const express=require("express")
const router= express.Router()
const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validate");
const {authenticateUser,authorizeUser} = require("../middlewares/auth");
const noticesCltr=require('../controllers/noticeCltr')
const newNoticeValidation=require('../validations/noticeValidation')

router.post('/new',authenticateUser,authorizeUser(["groupAdmin"]),checkSchema(newNoticeValidation),validate,noticesCltr.create)
router.get('/all/:id',authenticateUser,authorizeUser(["groupAdmin","member"]),noticesCltr.allNotices)

module.exports=router