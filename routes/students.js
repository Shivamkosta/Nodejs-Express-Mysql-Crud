var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM students ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/student/index.ejs
            res.render('students/index.ejs',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('students/index.ejs',{data:rows});
        }
    });
});

// display add student page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('students/add', {
        name: '',
        email: '',
        city:'',
        mobile:'',       
    })
})

// add a new student
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let email = req.body.email;
    let city = req.body.city;
    let mobile = req.body.mobile;
    let errors = false;

    if(name.length === 0 || email.length === 0 || city.length === 0 || mobile.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all fields");
        // render to add.ejs with flash message
        res.render('students/add', {
            name: name,
            email: email,
            city : city,
            mobile : mobile,
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            email: email,
            city : city,
            mobile : mobile
        }
        
        // insert query
        dbConn.query('INSERT INTO students SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('students/add', {
                    name: form_data.name,
                    email: form_data.email,
                    city:form_data.city,
                    mobile:form_data.mobile,                    
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/students');
            }
        })
    }
})

// display edit student page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM students WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/students')
        }
        // if student found
        else {
            // render to edit.ejs
            res.render('students/edit', {
                title: 'Edit Student', 
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                city:rows[0].city,
                mobile:rows[0].mobile
            })
        }
    })
})

// update student data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let city = req.body.city;
    let mobile = req.body.mobile;
    let errors = false;

    // 
    if(name.length === 0 || email.length === 0 || city === 0 || mobile.length === 0 ) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('students/edit', {
            id: req.params.id,
            name: name,
            email: email,
            city:city,
            mobile:mobile
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            email: email,
            city:city,
            mobile:mobile
        }
        // update query
        dbConn.query('UPDATE students SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('students/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    email: form_data.email,
                    city:form_data.city,
                    mobile:form_data.mobile
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/students');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM students WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to student page
            res.redirect('/students')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to student page
            res.redirect('/students')
        }
    })
})

module.exports = router;