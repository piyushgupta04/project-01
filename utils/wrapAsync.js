// function wrapAsync(fn){
//     return function(req, res, next){
//         fn().catch((err)=>{
//             next(err)
//         })
//     }
// }

// refactored arrow fn^
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err)=> next(err))
        // this stupid error! [I forgot to pass req, res and next in this fn()]
    }
}

module.exports = wrapAsync;