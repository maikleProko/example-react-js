const fs = require('fs');

class Market{
    constructor(io) {
        this.io = io;
        this.started = false;

        this.resetProfits();
    }

    resetProfits(){
        //Reset current profit
        let users = JSON.parse(fs.readFileSync("./public/json/users.json"));

        for (let user of users){
            user.curProfit = 0;
        }
        fs.writeFileSync("./public/json/users.json", JSON.stringify(users));
    }

    updateId(array){
        for(let i = 0; i < array.length; i++){
            array[i].id = i;
        }
    }

    startTrade(distribution){
        this.started = true;
        this.distribution = distribution;
    }

    endTrade(){
        this.started = false;
        this.resetProfits();
    }

    handleBuy(buy){
        fs.readFile("./public/json/sales.json", (err, data)=>{
            let sales = JSON.parse(data);
            let boughtSaleIndex = sales.findIndex((sale) => sale.id === buy.id);

            //Save part of data for later
            const stockName = sales[boughtSaleIndex].name;
            const stockPrice = sales[boughtSaleIndex].price;
            const sellerName = sales[boughtSaleIndex].sellerName;

            sales[boughtSaleIndex].amount -= buy.amount;
            if(sales[boughtSaleIndex].amount === 0){
                //Delete sale
                sales.splice(boughtSaleIndex, 1);
                this.updateId(sales);
            }

            fs.writeFile('./public/json/sales.json', JSON.stringify(sales), ()=>{});

            fs.readFile("./public/json/users.json", (err, data)=>{
                let users = JSON.parse(data);

                let buyer = users.find((user) => user.name === buy.name);
                let seller = users.find((user) => user.name === sellerName);
                let stockIndex = buyer.stocks.findIndex((stock) => stock.name === stockName);

                buyer.amount -= buy.amount * stockPrice;
                buyer.profit -= buy.amount * stockPrice;
                buyer.curProfit -= buy.amount * stockPrice;
                seller.amount += buy.amount * stockPrice;
                seller.profit += buy.amount * stockPrice;
                seller.curProfit += buy.amount * stockPrice;
                if(stockIndex === -1){
                    //Add new stock
                    buyer.stocks.push(
                        {
                            name: stockName,
                            amount: buy.amount
                        });
                }else{
                    //Add to existing stock
                    buyer.stocks[stockIndex].amount += buy.amount;
                }

                fs.writeFile('./public/json/users.json', JSON.stringify(users), ()=>{});

            });
        });
    }


    handleSell(sell){
        fs.readFile("./public/json/sales.json", (err, data)=>{
            let sales = JSON.parse(data);

            //Add sale
            sell.id = sales.length;
            sales.push(sell);
            fs.writeFile('./public/json/sales.json', JSON.stringify(sales), ()=>{});

            fs.readFile("./public/json/users.json", (err, data)=> {
                let users = JSON.parse(data);

                let seller = users.find((user) => user.name === sell.sellerName);
                let soldStockIndex = seller.stocks.findIndex((stock) => stock.name === sell.name);

                seller.stocks[soldStockIndex].amount -= sell.amount;

                if(seller.stocks[soldStockIndex].amount === 0){
                    seller.stocks.splice(soldStockIndex, 1);
                }

                fs.writeFile('./public/json/users.json', JSON.stringify(users), ()=>{});
            });
        });
    }

    handlePull(pull){
        fs.readFile("./public/json/sales.json", (err, data)=> {
                let sales = JSON.parse(data);

                let pulledSaleIndex = sales.findIndex((sale) => sale.id === pull.id);

                sales[pulledSaleIndex].amount -= pull.amount;

                const stockName = sales[pulledSaleIndex].name;
                const pullerName = sales[pulledSaleIndex].sellerName;

                if (sales[pulledSaleIndex].amount === 0) {
                    sales.splice(pulledSaleIndex, 1);
                }

                fs.writeFile('./public/json/sales.json', JSON.stringify(sales), ()=>{});

                fs.readFile('./public/json/users.json', (err, data) => {
                    let users = JSON.parse(data);
                    let puller = users.find((user) => user.name === pullerName);
                    let stockIndex = puller.stocks.findIndex((stock) => stock.name === stockName);

                    if(stockIndex === -1){
                        //Add stock back
                        puller.stocks.push(
                            {
                                name: stockName,
                                amount: pull.amount
                            });
                    }else{
                        //Add amount
                        puller.stocks[stockIndex].amount += pull.amount;
                    }

                    fs.writeFile('./public/json/users.json', JSON.stringify(users), ()=>{});
                });
            });
    }
}

module.exports = Market;