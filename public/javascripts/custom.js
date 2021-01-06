
function handleChangeQty(id) {
    const item = document.getElementById("price-"+id).innerHTML;
    const price = document.getElementById("num-"+id).value;
    const oldPrice = parseFloat(document.getElementById("tolPrice-"+id).innerHTML);
    const newPrice = parseFloat(item)*parseFloat(price);
    let totalPrice1 = document.getElementById("totalPrice1");
    let totalPrice2 =document.getElementById("totalPrice2");
    document.getElementById("tolPrice-"+id).innerHTML = newPrice ;

    totalPrice1.innerHTML = parseFloat(totalPrice1.innerHTML) + newPrice - oldPrice;
    totalPrice2.innerHTML = totalPrice1.innerHTML
    console.log('Có chạy vào nè');

}