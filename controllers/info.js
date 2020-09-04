// Initiating model
const Custinfo = require('../models/custinfo');

// //******************************** */

//add customer information
exports.addCustInfo = (req, res) => {
    try {
        const today = new Date()
        if (req.body.id && req.body.first_name) {
            const userData = {
                fid: req.body.id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                number: req.body.number,
                created: today
            }
            Custinfo.create(userData)
                .then(data => {
                    res.status(200).send({
                        "message": "success",
                        "status": true,
                        "data": data
                    });
                })
                .catch(err => {
                    res.status(400).send({
                        message: `error: ${err}`,
                        data: [],
                        status: false
                    });
                })
        } else {
            res.status(500).send({
                message: `required key missing`,
                data: [],
                status: false
            });
        }
    } catch (error) {
        res.status(400).send({
            message: `Exception: ${error}`,
            data: [],
            status: false
        });
    }
};