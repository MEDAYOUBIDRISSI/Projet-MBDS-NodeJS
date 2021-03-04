let Assignment = require("../model/assignment");
// add Json Web Token (Jwt)
const jwtToken = require('jsonwebtoken')
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
    verifyToken,
};
