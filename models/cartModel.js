const {ObjectId} = require('mongodb');
const {db} = require("../dal/db");
module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty =  oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function (item, id){
        let storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty:0, price: 0};
            this.totalQty++;
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price* storedItem.qty;

        this.totalPrice += parseInt(storedItem.item.price);
    };
    this.generateArray = function () {
        let arr = [];
        for (let id in this.items){
            arr.push(this.items[id]);

        }
        return arr;
    };
    this.deleteItem = id =>{
        let storedItem = this.items[id];
        if (storedItem) {
            this.totalQty--;
            this.totalPrice -= storedItem.price ;
            storedItem = this.items[id] = {item: null, qty: 0, price: 0, option: null, taxAmount: 0};
            delete this.items[id];
        }
    };
    this.changeQty = ( id, qty) => {
        const itemQty = qty ? Number(qty) : 1;
        let storeItem = this.items[id];
        if (storeItem) {
            let oldQty = storeItem.qty;
            storeItem.qty = itemQty;
            storeItem.price = storeItem.item.price * storeItem.qty;
            this.totalPrice += storeItem.price - storeItem.item.price * oldQty;
        }

    };
    this.addCart = cart => {
        for (let id in cart.items) {
            let storedItem = this.items[id];
            if (!storedItem) {
                storedItem = this.items[id] = {
                    item: cart.items[id].item,
                    qty: cart.items[id].qty,
                    price: cart.items[id].price,
                    images: cart.items[id].images
                };
                this.totalQty++;
            }
            else {
                storedItem.qty += parseInt(cart.items[id].qty);
                storedItem.price += cart.items[id].price;
            }
            this.totalPrice += cart.items[id].price;
        }
        return this;
    };
    this.saveCart = async (id) =>{
        const userCollection = db().collection('Carts');
        const result = await userCollection.updateOne({
            "_id": ObjectId(id)
        }, {
            $set: this
        });

        return result;
    }
    this.createCartDB = async () =>{
        const userCollection = db().collection('Carts');
        const result = await userCollection.insertOne(this);

        return result.insertedId;
    }

};
module.exports.findCart = async (id) =>{
    const cartCollection = db().collection('Carts');

    const cart = await cartCollection.findOne({
        _id: id
    });
    return cart;
}
