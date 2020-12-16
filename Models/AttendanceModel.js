

const attendaceSchema=mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_sign_in: {type:Timestamp}
   ,last_sign_out: {type:Timestamp}
   ,day: {type: String}
})