document.getElementById("rzp-button1").onclick = (e)=>{
  let amount = prompt("Enter the amount you want to donate (INR)");
  console.log(amount);
  const param = JSON.stringify({
    amount : amount,
  });
  const postOptions = {
    headers: {"content-type": "application/json"}
  }
  axios.post("/order", param, postOptions).then((info) => {
    console.log(info);
    let options = {
      key: "rzp_test_cFXBY0730gmh8B",
      name: "The Sparks Foundation",
      description: "Donate for a cause",
      image: "https://internship.thesparksfoundation.info/assests/img/logo.png",
      order_id: info.data.id,
      callback_url: "/verify",
      notes: {
        address: "The Sparks Foundation Network",
      },
      theme: {
        color: "#ff9c9c",
      },
    };
    let rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  });  
}
