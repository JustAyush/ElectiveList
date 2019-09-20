module.exports = {
    getHomePage: (req, res) => {
        let year_query = "SELECT DISTINCT year FROM `student`"; // query database to get all the player

        // execute query
        db.query(year_query, (err, result) => {
            if (err) {
                res.redirect('/');
            }

            let year = [];
            result.forEach((index) => {
              year.push(index.year);
            })

            res.render('index.ejs', {
                title: 'Elective List',
                year: year,
                courses: []
            });
        });
    },

  postHomePage: (req, res) => {
      let year = req.body.year;
      let section = req.body.section;

      res.redirect(`/${year}/${section}/student/assignCourseList`);

    }


};
