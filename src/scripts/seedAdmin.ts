import { UserRole } from "../enums/user_role";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {

        const adminData = {
            name: 'Admin-BlogSphere',
            email: process.env.ADMIN_EMAIL as string,
            role: UserRole.ADMIN,
            password: process.env.ADMIN_PASSWORD as string,
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData?.email
            }
        })

        if (existingUser) {
            throw new Error('admin id already exists in the app');
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": process.env.APP_URL!,
            },
            body: JSON.stringify(adminData)
        })
        console.log(signUpAdmin);

        if (signUpAdmin.ok) {
            await prisma.user.updateMany({
                where: {
                    email: adminData.email,
                },
                data: {
                    emailVerified: true,
                },
            });

            console.log("Admin email verified successfully");
        }




    } catch (error) {
        console.log(error);
    }
}

seedAdmin()