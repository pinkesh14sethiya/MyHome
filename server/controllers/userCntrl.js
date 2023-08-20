import asyncHandler from 'express-async-handler'

import {prisma} from "../config/prismaConfig.js"

export const createUser = asyncHandler(async(req,res)=> {
    console.log("creating a user");

    let {email} = req.body;
    const userExists =await prisma.user.findUnique({where: {email: email}})
    if(!userExists)
    {
        const user = await prisma.user.create({data: req.body});
        res.send({
            message: "User registered successfully",
            user: user,

        });
    }
    else res.status(201).send({message: "User already registered"});
});

// import asyncHandler from 'express-async-handler';
// import { prisma } from "../config/prismaConfig.js";

// export const createUser = asyncHandler(async (req, res) => {
//     console.log("creating a user");
//     console.log(req.body);

//     try {
//         const { email } = req.body.data || {};

//         // Ensure that the email property is provided and not undefined
//         if (!email) {
//             return res.status(400).send({ message: "Missing 'email' in request body." });
//         }

//         // Find the user with the provided email
//         const userExists = await prisma.user.findUnique({ where: { email: email } });

//         // Check if the user exists
//         if (userExists) {
//             return res.status(409).send({ message: "User with the provided email already exists." });
//         }

//         // Create the new user
//         const newUser = await prisma.user.create({ data: { email } });

//         res.send({
//             message: "User registered successfully",
//             user: newUser,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: "An error occurred while creating the user." });
//     }
// });


// function to book a visit to resd

// 
export const bookVisit = asyncHandler(async (req, res) => {
   // console.log("Request body:", req.body); // Add this line to log the request body
    const { email, date } = req.body;
    const { id } = req.params;

    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });
        if(alreadyBooked.bookedVisits.some((visit)=> visit.id===id)){
            res.status(400).json({message: "This residecny is already booked by you"})
        }
        else
        {
            await prisma.user.update({
                where: {email: email},
                data:{
                    bookedVisits: {push: {id,date}}
                }
            });
            res.send("your visit is booked successfully")
        }
        
    } catch (err) {
        throw new Error(err.message);
    }
});
 export const getAllBookings = asyncHandler(async (req,res)=> {
    const {email} = req.body
    try{
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        })
        res.status(200).send(bookings)
    }catch(err){
            throw new Error(err.message);
        }
    
 })

 //function to cancel the booking

 export const cancelBooking = asyncHandler(async (req, res)=> {
     
    const {email}= req.body;
     const {id}= req.params
     try{
            const user = await prisma.user.findUnique({
            where: {email: email},
            select: {bookedVisits: true}
        })
      const index = user.bookedVisits.findIndex((visit)=> visit.id===id) 
      if(index===-1){
        res.status(404).json({message: "Booking not found"})
      } else{
        user.bookedVisits.splice(index,1)
        await prisma.user.update({
            where: {email},
            data: {
                bookedVisits: user.bookedVisits
            }
        })
        res.send("booking cancelled successfully")
      }
     }catch(err){
        throw new Error(err.message);
     }
 })

 //function to add a resd in favourite list of a user

 export const toFav = asyncHandler(async(req,res)=>{
    const {email}= req.body;
    const {rid} = req.params;
    try{
         const user = await prisma.user.findUnique({
            where: {email}
         })
         if(user.favResidenciesId.includes(rid)){
            const updateUser = await prisma.user.update({
                where: {email},
                data:{
                    favResidenciesId :{
                        set: user.favResidenciesId.filter((id)=> id !== rid)
                    }
                }
            });
            res.send({message: "Removed from favorites", user: updateUser})
         } else{
            const updateUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidenciesId: {
                        push: rid
                    }
                }
            });
            res.send({message: "updated favorite", user: updateUser})
         }
    }catch(err)
    {
        throw new Error(err.message);
    }
 })

 //function to get all favorites
export const getAllFavorites = asyncHandler(async(req, res)=> {
    const {email} = req.body;
    try{
        const favResd = await prisma.user.findUnique({
            where: {email},
            select: {favResidenciesId: true}
        })
        res.status(200).send(favResd);
    }catch(err){
        throw new Error(err.message);
    }
});
