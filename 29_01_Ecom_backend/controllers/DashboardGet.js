const Image = require("../models/product");
const Userschemadb = require("../models/user");

async function DashboardGet(req, res) {
    try {
        const images = await Image.find();
        const user = req.user;

        if (!user || !user.email) {
            return res.status(400).send({ message: "User information is missing" });
        }

        const check = await Userschemadb.findOne({ email: user.email });
        console.log(check, "for cart display");

        if (check) {
            console.log(check.notify, "check notify");
            const productIdsNotify = check.notify.map(item => item._id.toString());

            // Filter valid products based on notify product IDs
            const validProducts = images.filter(product =>
                productIdsNotify.includes(product._id.toString())
            );
            console.log(validProducts, "its presented in notify");

            // Check if the valid products are already in the checknotify array
            // const newValidProducts = validProducts.filter(product => 
            //     !check.checknotify.some(existingProduct => 
            //         existingProduct._id.toString() === product._id.toString()
            //     )
            // );

            if (validProducts) {
                // If there are new valid products, update the checknotify array
                const updatenotify = await Userschemadb.updateOne(
                    { email: user.email },
                    { $set: { checknotify:validProducts  } }
                );
                console.log(updatenotify);

                return res.status(200).send({ images, valid: updatenotify });
            }

            return res.status(200).send({ images, valid: [] });
        } else {
            return res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(200).send({ message: "Error fetching images", code: 401 });
    }
}

module.exports = DashboardGet;
