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
                message: "",
                courses: []
            });
        });
    },

  postHomePage: (req, res) => {
      let year = req.body.year;
      let section = req.body.section;

      res.redirect(`/${year}/${section}/student/assignCourseList`);

    },

  getStudentListFromHome: (req, res) => {

    let year = req.body.year;
    let section = req.body.section;

    res.redirect(`/${year}/${section}/student`);
  },

  getElectiveList: (req, res) => {

    let elec_no = req.body.elec_no;
    elec_no = parseInt(elec_no.match(/\d+/)[0]);
    if (elec_no == 2){
      console.log("Elective 2");
    } else {
      console.log("Elective 3");
    }
    let section = req.body.section;

    res.redirect(`/${elec_no}/${section}/elective`);
  }




};
