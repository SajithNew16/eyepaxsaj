// var http = require('http'),
//     fs = require('fs');


// fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(8000);
// });
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send('The course with the given id was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);


    if (error)
        return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given id was not found');
        return;
    }

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);


    if (error)
        return res.status(400).send(error.details[0].message);


    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send('The course with the given id was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

const port = process.env.PORT || 3000;

// http.createServer(app).listen(app.get('port'), function () {
//     console.log('Express server listening on ' + app.get('port'));
// });

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}
