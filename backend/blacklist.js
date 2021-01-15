let blacklist=[];
function addToken(t){
    blacklist.push(t);
    console.log(blacklist);
}
function getTokens(){
    console.log(blacklist);
    return blacklist
}

module.exports={getTokens,addToken};