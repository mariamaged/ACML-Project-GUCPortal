const bcrypt=require("bcrypt");
x("123");


async function x(pass){

    const salt =await bcrypt.genSalt(10);
  
    const hash=await bcrypt.hash(pass,salt);
    console.log(hash);
}

// Jacklyn 123