let Assignment = require("../model/assignment");
// add Json Web Token (Jwt)
const jwtToken = require('jsonwebtoken')
var nb = 0;
/*
// Récupérer tous les assignments (GET)
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments); 
    });
}
*/

// AVEC PAGINATION
function getAssignments(req, res) {
    verifyToken(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var aggregateQuery = Assignment.aggregate();
            Assignment.aggregatePaginate(
                aggregateQuery,
                {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                },
                (err, assignments) => {
                    if (err) {
                        res.send(err);
                    }
                    res.send(assignments);
                }
            );
        }
    });

}

// get Assignment avec l'état 'rendu'

function getAssignmentsRendu(req, res) {
    /*(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {*/
    Assignment.find({rendu: true}, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json(assignment);
    });
    /*  }
  });*/

}

function getAssignmentsNonRendu(req, res) {
    /*(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {*/
    Assignment.find({rendu: false}, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json(assignment);
    });
    /*  }
  });*/

}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    verifyToken(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let assignmentId = req.params.id;
            Assignment.findOne({id: assignmentId}, (err, assignment) => {
                if (err) {
                    res.send(err);
                }
                res.json(assignment);
            });
        } 
    });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    verifyToken(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let assignment = new Assignment();
            assignment.id = req.body.id;
            assignment.nom = req.body.nom;
            assignment.dateDeRendu = req.body.dateDeRendu;
            assignment.rendu = req.body.rendu;
            // add new attributs
            assignment.matiere.libelle = req.body.matiere.libelle;
            console.log('nom : ', req)
            assignment.matiere.imgProf = req.body.matiere.imgProf;
            assignment.matiere.imgMat = req.body.matiere.imgMat;
            assignment.note = req.body.note;
            assignment.remarques = req.body.remarques;

            console.log("POST assignment reçu :");
            console.log(assignment);

            assignment.save((err) => {
                if (err) {
                    res.send("cant post assignment ", err);
                }
                res.json({message: `${assignment.nom} saved!`});
            });
        }
    });

}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    verifyToken(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            console.log("UPDATE recu assignment : ");
            console.log(req.body);
            Assignment.findByIdAndUpdate(
                req.body._id,
                req.body,
                {new: true},
                (err, assignment) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.json({message: "updated"});
                    }

                    // console.log('updated ', assignment)
                }
            );
        }
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    verifyToken(req, res)
    jwtToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
                if (err) {
                    res.send(err);
                }
                res.json({message: `${assignment.nom} deleted`});
            });
        }
    });

}

// Pour le chart js

// Récupérer un assignment par son id (GET)

async function getNbByNote($min, $max) {
    nb = 0
    await Assignment.find({note: {$lte: $min}, note: {$gte: $max}}, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        nb = assignment.length
        console.log("1=>", nb)
    });
    console.log("2=>", nb)
    return nb;
}

async function chartsJs(req, res) {
    resTab = [
        {
            "name": "0-4",
            "value": await getNbByNote(0, 4)
        }, {
            "name": "5-9",
            "value": await getNbByNote(5, 9)
        }, {
            "name": "10-15",
            "value": await getNbByNote(10, 15)
        }, {
            "name": "16-20",
            "value": await getNbByNote(16, 20)
        }
    ];
    console.clear();
    res.send(resTab)
}

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        // next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

module.exports = {
    getAssignments,
    postAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsRendu,
    getAssignmentsNonRendu,
    chartsJs,
    verifyToken,
};
