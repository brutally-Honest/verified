const Group=require('../models/group-model')

const newNoticeValidation={
    groupAdmin:{notEmpty:{errorMessage:"Group Admin is required",bail:true},
    isMongoId:{errorMessage:"Invalid MongoId",bail:true},},
    group:{
        notEmpty:{errorMessage:"Group is required",bail:true},
        isMongoId:{errorMessage:"Invalid MongoId",bail:true},
        custom:{
            options:async(value,{req})=>{
                const group=await Group.findOne({_id:value,groupAdmin:req.body.groupAdmin,status:'approved'})
                if(!group) throw new Error('Group not approved / Cant send notice to other groups!')

            }
        }
    },
    notice:{notEmpty:{errorMessage:"Notice is required",bail:true},
    }
}

module.exports=newNoticeValidation