const router = require('express').Router()
const bcrypt = require('bcryptjs')

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json({err, message: 'an error has occured'})
        })
})

router.post('/login', (req, res) => {
    let {username, password} = req.body

    Users.findBy({username})
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ mesage: `Welcome ${user.username}` })
            } else {
                res.status(401).json({message: 'invalid credentials'})
            }
        })
        .catch(err => {
            res.status(500).json({err, message: 'there was an error with the database'})
        })
})

module.exports = router