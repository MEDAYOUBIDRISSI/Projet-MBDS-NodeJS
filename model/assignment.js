let mongoose = require("mongoose");
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({ 
  id: Number,
  dateDeRendu: Date,
  nom: String,
  rendu: Boolean,
  // new Attributs
  auteur: String,
  matiere: {
    libelle: String,
    imgProf: String,
    imgMat: String,
  },
  note: Number,
  remarques: String,

});
AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model("Assignment", AssignmentSchema);
