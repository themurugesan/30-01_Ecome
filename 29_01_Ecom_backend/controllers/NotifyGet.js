const User = require('../models/user');


async function NotifyGet(req, res) {
  try {
    const user = req.user;
    if (!user || !user.email) {
      return res.status(400).send({ message: 'User information is missing' });
    }

    const check = await User.findOne({ email: user.email }); 
    console.log(check, 'for cart display');

    if (check) {
      // console.log(check.notify, "check notify");
      

      return res.status(200).send({ cart: check.checknotify[0] });
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send({ message: 'Error fetching cart', error });
  }
}

module.exports = { NotifyGet };
