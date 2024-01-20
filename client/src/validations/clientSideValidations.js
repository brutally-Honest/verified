import * as Yup from "yup";
import isEmailValidator from 'validator/lib/isEmail';

const emailSchema={email:Yup.string()
  .required("Email is required*")
  .test(
    "is-valid",
    (message) => `Invalid Email format`,
    (value) =>
      value
        ? isEmailValidator(value)
        : new Yup.ValidationError("Invalid value")
  )}

const phoneSchema={phone:Yup.string()
    .required("Phone Number is required*")
    .min(10, "Must be 10 digits")
    .max(10, "Must be 10 digits")
  }

export const userLoginSchema = Yup.object().shape({
  email:emailSchema.email,
  password: Yup.string().required("Password is required*"),
});

export  const groupRegisterationSchema = Yup.object().shape({
    userName: Yup.string().required("Name is required*"),
    userPhoneNumber: phoneSchema.phone,
    email: emailSchema.email,
    password: Yup.string()
      .min(8, "Must be atleast 8 characters long")
      .required("Password is required*"),
  });
export  const memberRegisterationSchema = Yup.object().shape({
    userName: Yup.string().required("Name is required*"),
    userPhoneNumber: phoneSchema.phone,
    email: emailSchema.email,
    password: Yup.string()
      .min(8, "Must be atleast 8 characters long")
      .required("Password is required*"),
    groupCode:Yup.string().required("Group Code is required*")
  });

export const groupCreationSchema=Yup.object().shape({
  groupName:Yup.string().required("Group Name is required*"),
  groupPhoneNumber: phoneSchema.phone,
  blocks:Yup.array().of(
    Yup.object().shape({
      blockName:Yup.string().required("Block Name is required*"),
      blockUnits:Yup.array().of(
        Yup.object().shape({
          unit:Yup.number().required("Unit Number is required*")
        })
      )
    })
  ),
  groupAdmin:Yup.string().required("Group Admin is required*")
})

export const newVisitorSchemaGaurd=Yup.object().shape({
  visitorType:Yup.string().required("Visitor Type is required*"),
  visitorName:Yup.string().required("Visitor Name is required*"),
  visitorPhoneNumber:phoneSchema.phone,
  block:Yup.string().required("Block is required*"),
  unit:Yup.string().required("Unit is required*")
})
export const newVisitorSchemaMember=Yup.object().shape({
  visitorType:Yup.string().required("Visitor Type is required*"),
  visitors:Yup.array().of(
    Yup.object().shape({
      visitorName:Yup.string().required("Visitor Name is required*"),
      visitorPhoneNumber:phoneSchema.phone,
    })
  ),
})

export const updateProfileSchema=Yup.object().shape({
  userName:Yup.string().required("Username is required*"),
  userPhoneNumber: phoneSchema.phone,
  email: emailSchema.email,
})