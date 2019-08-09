module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `course` ORDER BY course_id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            console.log(result);
            res.render('electiveList.ejs', {
                title: 'Elective List',
                courses: result,
            });
        });
    },
};
