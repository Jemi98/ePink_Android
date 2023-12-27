function initTopUpDetails(id){
   var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&topUpID="+id+"&topUpDetails=true";
   var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
            console.log(response);
            document.getElementById("payment-amount").innerHTML="RM"+response.amount;
            document.getElementById("payment-user_name").innerHTML=response.fullname;
            document.getElementById("payment-status").innerHTML=response.order_status;
            document.getElementById("payment-type").innerHTML=response.type;
            document.getElementById("payment-date").innerHTML=response.senang_date;
            document.getElementById("topupid").innerHTML="ID: #"+response.id;
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    };
    users.send(dataTopost);
}

function initTransactionDetails(id){
    var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&transactionID="+id+"&transactionDetails=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
            console.log(response);
            document.getElementById("transaction-amount").innerHTML="RM"+response.amount;
            document.getElementById("transaction-receiver_name").innerHTML=response.to_user;
            document.getElementById("transaction-sender_name").innerHTML=response.from_user;
            document.getElementById("transaction-note").innerHTML=response.transaction_note;
            document.getElementById("transaction-date").innerHTML=response.transaction_date;
            document.getElementById("trasnsactionid").innerHTML="ID: #"+response.id;
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    };
    users.send(dataTopost);
}