var mngSchema = new mongoose.Schema({
    Id: {type: String, unique: true},
    Name: String
});
mngSchema.methods.speak = function () {
    console.log(this);
};
var mngModel = mongoose.model('Station', mngSchema);

exports.create = function (data) {
    var model = new mngModel(data);

    model.save();
};