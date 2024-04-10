# Verified

A visitor management system presents a simple yet powerful solution designed for tracking and authorizing visitors entering a facility. This version focuses on group management, payment approval, and streamlined processes for group admins, members, and guards. This version has real-time alerts of visitors entering the facility. The members of the facility whom the visitors want to visit, authorize their entry.
The members can also request the gaurd for a video call to view the visitors. Visitors can also be pre-approved ahead of time to facilitate smooth verification process. The visitors who are pre-approved are verified through 2-Step Verification process by providing a Key which is shared prior to their visit and OTP which is sent to their respective Phone number once the KEY is verified. Below is an elaborate guide on the technologies used, and features implemented in this version.

## Technologies Used
- Backend - <b>Express</b> 
- Frontend - <b>React</b> 
- Database - <b>MongoDB</b>  
- Storage - <b>AWS S3</b>  
- Authentication - <b>JWT</b>  
- Real-Time Communication - <b>Socket.io</b>  
- Video Call Implementation - <b>WebRTC</b>  
- Payment Integration - <b>Stripe</b>  

## Features
 ### Roles
 1. <b><u>Admin</u></b> : Oversee group verification after group account creation. Once payment is made, admin can approve groups, enabling group admins to manage members and gaurds within their repective groups.

 2. <b><u>Group Admin</u></b> : Group account belongs to group admins. They are respresentatives of the groups to whom the facility belongs. Group admin can manage and oversee the verification of members, addition of gaurd to the group, and can add notices to the group notice board.

 3. <b><u>Members</u></b> : Individuals associated with the facility who can register in the platform with their group's respective group code. Members approved by their respective group admins can view notices and authorize visitors.

 4. <b><u>Gaurd</u></b> : Responsible for managing the facility's security and sending alerts asking for permission from approved members to authorize the visitors. Gaurd sends a picture of the visitor along with necessary details to the the member to whom the visitor wants to visit. Then upon receiving permission from the member, gaurd allows or denies entry   

 ### Group Management 
 - Group Creation
 - Accepting and Approving members 
 - Notice board management
 - Payments

### Real-time Alerts
- Guards can send real-time alerts to members when visitors enter the facility.
- Members can then authorize or deny entry to the visitors.
- This is implemented through Socket.io 

### Visitor Photo
 - A photo of the visitor is taken during the verification process through webcam which is then sent to the respective member. 
 - This is implemented with the help of react-webcam package.
 - This photo is then stored in AWS S3 bucket for future reference and security reasons. 

### Video Call
- During the verification, members can request video call to visually verify visitor's identity. 
- This is achieved through WebRTC implementation.

### Pre-Approval
- Members have the option to pre-approve visitors ahead of time.
- Pre-approved visitors undergo a 2-Step Verification process:
    - <b>Key</b>: Shared prior to the visit.
    - <b>OTP</b>: Sent to the visitor's phone number using Twilio after the Key is verified.

## Highlights
| Task                         | Implementation using                          | 
| :---                         |    :----:                                     |
| Real-time alerts             | Socket.io                                     |
| Video Call                   | WebRTC                                        |
| OTP                          | Twilio                                        |
| Photo Storage                | AWS S3                                        |
| UI                           | Tailwind CSS                                  |
| State Management             | Redux and React Context + useReducer          |
| Client-side Routing          | React-Router-Dom                              |
| Client-side Form Validation  | Formik and Yup                                |
| Password Encryption          | BcryptJs                                      |
| User Authentication          | JWT                                           |
| Server-side Validation       | Express-Validator                             |