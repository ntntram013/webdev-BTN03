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
            arr.push(this.items[id])

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
    this.changeQty = (item, id, qty) => {
        const itemQty = qty ? Number(qty) : 1;
        let storeItem = this.items[id];
        if (!storeItem) {
            storeItem = this.items[id] = { item: item, qty: 0, price: 0, images: '' };
            this.totalQty++;
        }
        let oldQty = storeItem.qty;
        storeItem.qty = itemQty;
        storeItem.price = storeItem.item.price * storeItem.qty;
        storeItem.images = storeItem.item.images[0];
        this.totalPrice += storeItem.price - storeItem.item.price * oldQty;
    };
};
