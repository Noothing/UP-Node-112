module.exports = () => {

    this.identificationError = (error) => {
        if (Array.isArray(error)){
            console.log('Array')
            error.forEach((e) => {
                console.log(e.constructor.name)
            })
        }else{
            console.log('Object')
            console.log(error.message)
        }
    }

    return this
}