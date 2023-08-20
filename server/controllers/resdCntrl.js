// import asyncHandler from "express-async-handler";
// import { prisma } from '../config/prismaConfig.js';

// export const createResidency = asyncHandler(async (req, res) => {
//     console.log('Going in');
//     console.log(req.body.data);
//     try {
//         const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data;

//         const residency = await prisma.residency.create({
//             data: {
//                 title,
//                 description,
//                 price,
//                 address,
//                 country,
//                 city,
//                 facilities,
//                 image,
//                 owner: { connect: { email: userEmail } },
//             },
//         });

//         res.send({ message: "Residency created successfully", residency });
//     } catch (err) {
//         if (err.code === "P2002") {
//             throw new Error("A residency with address already exists");
//         }
//         throw new Error(err.message);
//     }
// });


import asyncHandler from 'express-async-handler';
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
    console.log('Going in');
    console.log(req.body.data);

    try {
        const { title, description, price, address, city, country, image, facilities, userEmail } = req.body.data;

        // Ensure that the 'userEmail' property is provided and not undefined
        if (!userEmail) {
            return res.status(400).send({ message: "Missing 'userEmail' in request body." });
        }

        // Find the user with the provided email
        const userExists = await prisma.user.findUnique({ where: { email: userEmail } });

        // Check if the user exists
        if (!userExists) {
            return res.status(404).send({ message: "User not found. Please create the user first." });
        }

        // Create the residency with the correct 'owner' relation
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                city,
                country,
                image,
                facilities,
                owner: { connect: { email: userEmail } },
            },
        });

        res.send({ message: "Residency created successfully", residency });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "An error occurred while creating the residency." });

    }
});

  //function to get all the documents/residencies
 export const getAllresidencies = asyncHandler(async (req,res) =>{
        const residencies = await prisma.residency.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.send(residencies);
    });

    //function to get a specific documents/residency
    export const getResidency = asyncHandler(async (req,res) => {
        const {id} = req.params;
        try{
            const residency = await prisma.residency.findUnique({
                where: {id},
            });
            res.send(residency);
        } catch(err) { 
            throw new Error(err.message);
        }
   });
