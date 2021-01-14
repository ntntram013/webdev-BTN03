const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

module.exports.orderCartDetail = function (req, res, next){
    if(req.session.cart && req.session.cart!={}){
        let cart = new cartModel (req.session.cart ? req.session.cart :{});
        res.render('order',{title: 'Đặt hàng',books: cart.generateArray(), totalPrice: cart.totalPrice, user: req.user});
    }
    else{
        res.redirect("back");
    }
}
module.exports.orderCreate = async (req,res,next) => {
    const userId = req.user._id;
    const name = req.user.name;
    const {userPhone, userAddress, userNote} = req.body;
    const info = {userPhone, userAddress, userNote};
    const user = {userId, info};
    let cart = new cartModel(req.session.cart ? req.session.cart :{})
    let errors = [];

    if (!userPhone || !userAddress) {
        errors.push('Vui lòng điền đầy đủ thông tin!');
    } else {
        if ((/^\d+$/.test(userPhone.toString())) == false) {
            errors.push('Số điện thoại không hợp lệ!');
        }
    }
    // render errors msg
    if (errors.length > 0) {
        res.render('order', {
            title: 'Đặt hàng',
            user: {name:name, phone: userPhone,address: userAddress,note:userNote },
            books: cart.generateArray(),
            totalPrice: cart.totalPrice,
            errors: errors
        });
        return;
    } else {
        const  result =  await orderModel.add(user,cart);
        if(result.insertedId){
            req.session.cart = null;
            let cart = new cartModel({});
            if (req.user) {
                await cart.saveCart(req.user.cart);
            }

        }
        res.redirect("/order/view");

    }
}
module.exports.orderList = async (req,res,next) =>{

    let [orderProcessing, orderDelivering, orderDelivered] = await Promise.all(
        [orderModel.listOrder(req.user._id,'Processing'),
                orderModel.listOrder(req.user._id,'Deliver'),
                 orderModel.listOrder(req.user._id,'Delivered'),]);
    res.render('userOrder',{title: 'Lịch sử mua hàng',orderProcessing,orderDelivering,orderDelivered});

}
