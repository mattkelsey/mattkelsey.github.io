//Import all of the necessary npm packages
var https = require('https');
var fs = require('fs');
var dominos = require('dominos');
var async = require('async');

//initialize global variables
var closestID;
var finalPrice;
var finalfinalorder;

//Verify with Amazon
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

//Begin an asyc series. This is used because we need to retrieve data (which takes a few seconds) before the Echo can say it.
async.series([
        //Find the closest store to a specified address, eventually this will be changed to pull the address from the GPS data of the Amazon Echo.
        dominos.store.find('1100 12th Avenue, 98122', 
        function(storeData){
            //console.log(storeData);
            closestID = storeData.result.Stores[0].StoreID;

            var order=new dominos.class.Order();
            order.Order.Phone='2067905989';
            order.Order.FirstName='Matt';
            order.Order.LastName='Kelsey';
            order.Order.Email='mattkelseymk@gmail.com';
            order.Order.Address=storeData.result.Address; //set order address object to validated address
            order.Order.StoreID=storeData.result.Stores[0].StoreID; //use closest store
            dominos.store.menu(
                storeData.result.Stores[0].StoreID, //storeID
                function(storeID){
                    var product=new dominos.class.Product();
                    product.Code='P12IPAUH' //14" Hand Tossed Cheese Pizza mmmm delicous (actually this is now a Hawaiian pizza... still, yum)
                    order.Order.Products.push(product);
                    dominos.order.validate(
                        order,
                        function(orderData){
                            if(orderData.success!=true){
                                //console.log(orderData);
                                return;
                            }
                            order=orderData.result;

                            dominos.order.price(
                                order,
                                function(priceData){
                                    var cardInfo=new dominos.class.Payment();
                                    cardInfo.Amount=priceData.result.Order.Amounts.Customer;
                                    finalPrice = priceData.result.Order.Amounts.Customer;
                                    console.log(finalPrice);

                                    //card info
                                    cardInfo.Number='XXX';
                                    cardInfo.CardType='XXX';
                                    cardInfo.Expiration='XXX';
                                    cardInfo.SecurityCode='XXX';
                                    cardInfo.PostalCode='XXX';

                                    order.Order.Payments.push(cardInfo);
                                    //console.log(order);
                                    finalfinalorder = "..";
                                    console.log(order.Order.Products);
                                    console.log(order.Order.Products.descriptions);
                                    console.log(order.Order.Payments);
                                    // dominos.order.place(
                                    //     order,
                                    //     function(data){
                                    //         console.log(data);

                                    //         if(data.result.Order.Status==-1){
                                    //             console.log(
                                    //                 '\n###### NO PIZZA FOR YOU! ######\n',
                                    //                 orderData.result.Order.StatusItems,
                                    //                 '\n#########################\n\n'
                                    //             );
                                    //             return;
                                    //         }

                                    //     }
                                    // );


                                }
                            );
                        }
                    );
                }
            );
        }
    ),
    https.createServer(options, function(req, res) {
    function sendResponse() {

        myResponse = JSON.stringify(echoResponse);
        //console.log(myResponse, {depth:5});
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);

    }

    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {depth: 5});

            //init variables for echo response
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Welcome to Domino's. Say order followed by the type of item you would like."

            //By default, don't end the session because in most instances we need the user to continue interacting
            echoResponse.response.shouldEndSession = "false";

            //parse request
            theRequest = JSON.parse(jsonString);

            if (theRequest.request.type == 'IntentRequest') {
                choice = theRequest.request.intent.slots.Choice.value;
                if (choice === "pizza"){
                    console.log(finalPrice,finalPrice,finalPrice,finalPrice,finalPrice,finalPrice,finalPrice);
                    var stringedprice = finalPrice.toString().split(".");
                    echoResponse.response.outputSpeech.text = "The final price will be " + stringedprice[0] + " dollars and " + stringedprice[1] + " cents. Is this ok?";
                } else if(choice === "yes") {
                    echoResponse.response.outputSpeech.text = "Ordering a Medium Handmade Pan Honolulu Hawaiian Pizza. Thank you for choosing Domino's!";
                    console.log(finalfinalorder,finalfinalorder,finalfinalorder,finalfinalorder,finalfinalorder,finalfinalorder,finalfinalorder);
                    echoResponse.response.shouldEndSession = "true";
                    dominos.order.place(
                        finalfinalorder,
                        function(data){
                            console.log(data);

                            if(data.result.Order.Status==-1){
                                console.log(
                                    '\n###### NO PIZZA FOR YOU! ######\n',
                                    orderData.result.Order.StatusItems,
                                    '\n#########################\n\n'
                                );
                                return;
                            }

                        }
                    );

                    //req.connection.destroy();
                } else if(choice === "no") {
                    echoResponse.response.outputSpeech.text = "Please repeat your order or say exit.";
                } else {
                    echoResponse.response.outputSpeech.text = "Sorry, I didn't get that. Please try again.";
                }

            }

            sendResponse();
            console.dir(echoResponse, {depth: 5});  


        });
    } else {
        sendResponse();
    }

}).listen(3016)

]);

