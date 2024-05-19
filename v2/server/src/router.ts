import express from 'express'
const router=express.Router()
import usersRouter from './api/users/route.js'
import groupsRouter from "./api/groups/route.js"

router.use('/users',usersRouter)
router.use('/groups',groupsRouter)
export default router