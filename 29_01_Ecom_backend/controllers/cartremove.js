const Userschemadb = require('../models/user');

// Update user cart
async function CartPut(req, res) {
  try {
    const updatedCartItem = req.body;  // Now expecting a single item
    // console.log(updatedCartItem,'updated cart item')
    const user = req.user;

    // console.log(updatedCartItem, "data from front end delete");

    if (!user || !user.email) {
      return res.status(400).send({ message: 'User information is missing' });
    }

    const userRecord = await Userschemadb.findOne({ email: user.email });

    // console.log(userRecord, "db check");

    if (userRecord) {

      let cart = userRecord.cart.filter(item=>item._id===updatedCartItem.id)
      // console.log(cart,"carttttt")
      
      const updatenotify=await Userschemadb.updateOne({email:user.email},{$push:{notify:cart[0]}})


      // Use $pull to remove the item by _id from the cart

      if(updatenotify){
        
        await Userschemadb.updateOne(
          { email: user.email },
          { $pull: { cart: { _id: updatedCartItem.id } } } 
           // Correctly target the item by its ID
        );
        return res.status(200).send({ message: 'Cart updated successfully' });
        
      }
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send({ message: 'Error updating cart', error });
  }
}


module.exports = { CartPut };
