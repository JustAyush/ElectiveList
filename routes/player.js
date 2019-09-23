const fs = require('fs');

module.exports = {

  //for course assigned

  assignCoursePage: (req, res) => {

    let elective2 = "SELECT * FROM elective2;";
    let elective3 = "SELECT * FROM elective3;";

    db.query(elective2, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let elective2_list = result;

      db.query(elective3, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elective3_list = result;

        res.render('assignCourse.ejs', {
          title: 'Elective List',
          message: '',
          elective2: elective2_list,
          elective3: elective3_list,
        });
      });

    });

  },

  assignCourse: (req, res) => {

    let year = req.params.year;
    let sec = req.params.sec;
    let id = req.params.id;

    let elective2_section = req.body.elective2;
    let elective2, elective2_sec, elective3, elective3_sec;

    // to select elective name and section from DBMS (BEX)
    try{
      elective2_sec = elective2_section.match(/\(([^)]+)\)/)[1];
      elective2 = elective2_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective2 = elective2.join(' ');

    } catch(err){
      elective2 = ' ';
      elective2_sec = ' ';
    }

    let elective3_section = req.body.elective3;

    try{
      elective3_sec = elective3_section.match(/\(([^)]+)\)/)[1];
      elective3 = elective3_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective3 = elective3.join(' ');
    } catch(err){
      elective3 = ' ';
      elective3_sec = ' ';
    }

    let elec2_id_query = "SELECT * FROM elective2 WHERE elec2_name = '" + elective2 + "' AND elec2_sec = '" + elective2_sec + "';";
    let elec3_id_query = "SELECT * FROM elective3 WHERE elec3_name = '" + elective3 + "' AND elec3_sec = '" + elective3_sec + "';";


    db.query(elec2_id_query, (err, result1) => {
      if (err) {
        res.render('assignCourseEdit.ejs', {
          title: 'Elective List',
          message: 'Elective 2 already assigned',
          elective2: elective2_list,
          elective3: elective3_list,
        });
      }


      db.query(elec3_id_query, (err, result2) => {
        if (err) {
          res.render('assignCourseEdit.ejs', {
            title: 'Elective List',
            message: 'Elective 3 already assigned',
            elective2: elective2_list,
            elective3: elective3_list,
          });
        }

        let elec2_id, elec3_id;

        if(result1.length == 0){
          elec2_id = null;
        } else {
          elec2_id = result1[0].elec2_id;
        }

        if(result2.length == 0){
          elec3_id = null;
        } else {
          elec3_id = result2[0].elec3_id;
        }

        let query;

        if (elec2_id!= null && elec3_id!=null){
          query = "INSERT INTO takes (year, sec, stu_id, elec2_id, elec3_id) VALUES ('" + year+ "', '" + sec + "' , '" + id+ "', '" + elec2_id+ "', '" + elec3_id+ "') ;";
        }
         else {
          return res.send("both the electveII and electiveIII should be chosen!!");
        }

        db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.redirect(`/${year}/${sec}/student/assignCourseList`);
        });

      });
    });

  },

  assignCourseList: (req, res) => {

    let year = req.params.year;
    let sec = req.params.sec;

    let query = "SELECT * FROM (((takes LEFT JOIN elective2 ON takes.elec2_id = elective2.elec2_id) LEFT JOIN elective3 ON takes.elec3_id = elective3.elec3_id) LEFT JOIN student ON takes.year = student.year && takes.sec = student.sec && takes.stu_id = student.stu_id) WHERE student.year = '" + year + "' AND student.sec = '" + sec + "';";// query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }

      res.render('assignCourseList.ejs', {
        title: 'Assigned Course List',
        assigncourses: result,
        year: year,
        sec: sec
      });
    });

  },

  assignCourseEditPage: (req, res) => {

   let elective2 = 'SELECT * FROM elective2';
   let elective3 = 'SELECT * FROM elective3';

   db.query(elective2, (err, result) => {
     if (err) {
       return res.status(500).send(err);
     }

     let elective2_list = result;

     db.query(elective3, (err, result) => {
       if (err) {
         return res.status(500).send(err);
       }

       let elective3_list = result;

       res.render('assignCourseEdit.ejs', {
         title: 'Elective List',
         message: '',
         elective2: elective2_list,
         elective3: elective3_list,
       });
     });

   });

 },

  assignCourseDelete: (req, res) =>  {

    let year = req.params.year;
    let section = req.params.sec;
    let stu_id = req.params.id;

    let query = "DELETE FROM `takes` WHERE year = '" + year + "' AND  sec = '" + section + "' AND stu_id = '" + stu_id + "';";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect(`/${year}/${section}/student/assignCourseList`);
    });

  },

  assignCourseEdit:(req, res) => {

    let stu_id = req.params.id;
    let year = req.params.year;
    let sec = req.params.sec;
    let elective2_section = req.body.elective2;

    let elective2, elective3, elective2_sec, elective3_sec;

    try{
      elective2_sec = elective2_section.match(/\(([^)]+)\)/)[1];
      elective2 = elective2_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective2 = elective2.join(' ');

    } catch(err){
      elective2 = ' ';
      elective2_sec = ' ';
    }

    let elective3_section = req.body.elective3;


    try{
      elective3_sec = elective3_section.match(/\(([^)]+)\)/)[1];
      elective3 = elective3_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective3 = elective3.join(' ');
    } catch(err){
      elective3 = ' ';
      elective3_sec = ' ';
    }

    let elec2_id_query = "SELECT elec2_id FROM elective2 WHERE elec2_name = '" + elective2 + "' AND elec2_sec = '" + elective2_sec + "';";
    let elec3_id_query = "SELECT elec3_id FROM elective3 WHERE elec3_name = '" + elective3 + "' AND elec3_sec = '" + elective3_sec + "';";

    db.query(elec2_id_query, (err, result1) => {
      if (err) {
        return res.status(500).send(err);
      }

      db.query(elec3_id_query, (err, result2) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elec2_id, elec3_id;

        if(result1.length == 0){
          elec2_id = null;
        } else {
          elec2_id = result1[0].elec2_id;
        }

        if(result2.length == 0){
          elec3_id = null;
        } else {
          elec3_id = result2[0].elec3_id;
        }

            let query = "UPDATE `takes` SET `elec2_id` = '" + elec2_id + "', `elec3_id` = '" + elec3_id + "' WHERE year = '" + year + "' AND  sec = '" + sec + "' AND stu_id = '" + stu_id + "';";

            db.query(query, (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.redirect(`/${year}/${sec}/student/assignCourseList`);
            });
          });
        });
  },


  // for instructor
  getInstructorList: (req, res) => {

    // let query = "SELECT * FROM ((instructor INNER JOIN elective2 ON instructor.elec2_id = elective2.elec2_id) INNER JOIN elective3 ON instructor.elec3_id = elective3.elec3_id);";

    let query = "SELECT * FROM ((instructor LEFT JOIN elective2 ON instructor.elec2_id = elective2.elec2_id) LEFT JOIN elective3 ON instructor.elec3_id = elective3.elec3_id);";

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }
      res.render('instructorList.ejs', {
        title: 'Elective List',
        message: '',
        instructors: result
      });

    });

    },

  addInstructor: (req, res) => {

    let f_name = req.body.f_name;
    let l_name = req.body.l_name;

    let elective2_section = req.body.elective2;
    let elective2, elective2_sec, elective3, elective3_sec;

    try{
      elective2_sec = elective2_section.match(/\(([^)]+)\)/)[1];
      elective2 = elective2_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective2 = elective2.join(' ');

    } catch(err){
      elective2 = ' ';
      elective2_sec = ' ';
    }

    let elective3_section = req.body.elective3;

    try{
      elective3_sec = elective3_section.match(/\(([^)]+)\)/)[1];
      elective3 = elective3_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective3 = elective3.join(' ');
    } catch(err){
      elective3 = ' ';
      elective3_sec = ' ';
    }

    let elec2_id_query = "SELECT * FROM elective2 WHERE elec2_name = '" + elective2 + "' AND elec2_sec = '" + elective2_sec + "';";
    let elec3_id_query = "SELECT * FROM elective3 WHERE elec3_name = '" + elective3 + "' AND elec3_sec = '" + elective3_sec + "';";


    db.query(elec2_id_query, (err, result1) => {
      if (err) {
        return res.status(500).send(err);
      }


      db.query(elec3_id_query, (err, result2) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elec2_id, elec3_id;

        if(result1.length == 0){
          elec2_id = null;
        } else {
          elec2_id = result1[0].elec2_id;
        }

        if(result2.length == 0){
          elec3_id = null;
        } else {
          elec3_id = result2[0].elec3_id;
        }

        let query;

        if (elec2_id ==  null){
          query = "INSERT INTO instructor (first_name, last_name, elec2_id, elec3_id) VALUES ('" + f_name+ "', '" + l_name + "', NULL , '" + elec3_id + "') ;";
        } else if (elec3_id ==  null) {
          query = "INSERT INTO instructor (first_name, last_name, elec2_id, elec3_id) VALUES ('" + f_name+ "', '" + l_name + "', '" + elec2_id + "', NULL) ;";
        } else {
          query = "INSERT INTO instructor (first_name, last_name, elec2_id, elec3_id) VALUES ('" + f_name+ "', '" + l_name + "', '" + elec2_id + "', '" + elec3_id + "') ;";
        }

        db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.redirect('/instructor');
        });

      });
    });

  },

  addInstructorPage: (req, res) => {

    let elective2 = 'SELECT * FROM elective2';
    let elective3 = 'SELECT * FROM elective3';

    db.query(elective2, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let elective2_list = result;

      db.query(elective3, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elective3_list = result;

        res.render('addInstructor.ejs', {
          title: 'Elective List',
          message: '',
          elective2: elective2_list,
          elective3: elective3_list,
        });
      });

    });

  },

  editInstructorPage: (req, res) => {

    let ins_id = req.params.id;
    // let instructor = "SELECT * FROM instructor WHERE ins_id = '"+ ins_id +"';";

    let elective2 = 'SELECT * FROM elective2';
    let elective3 = 'SELECT * FROM elective3; SELECT * FROM instructor WHERE ins_id = ? ;';

    db.query(elective2, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let elective2_list = result;

      db.query(elective3, [ins_id] , (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elective3_list = result[0];

        console.log("------here--------");
        console.log(result[1][0]);

        res.render('editInstructor.ejs', {
          title: 'Elective List',
          message: '',
          elective2: elective2_list,
          elective3: elective3_list,
          instructor: result[1][0]

        });
      });

    });

  },

  editInstructor: (req, res) => {

    let ins_id = req.params.id;

    let f_name = req.body.f_name;
    let l_name = req.body.l_name;

    let elective2_section = req.body.elective2;

    let elective2, elective3, elective2_sec, elective3_sec;

    try{
      elective2_sec = elective2_section.match(/\(([^)]+)\)/)[1];
      elective2 = elective2_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective2 = elective2.join(' ');

    } catch(err){
      elective2 = ' ';
      elective2_sec = ' ';
    }

    let elective3_section = req.body.elective3;

    try{
      elective3_sec = elective3_section.match(/\(([^)]+)\)/)[1];
      elective3 = elective3_section.replace(/\([^\)]*\)/g, '').match(/(\S+)/g);
      elective3 = elective3.join(' ');
    } catch(err){
      elective3 = ' ';
      elective3_sec = ' ';
    }

    let elec2_id_query = "SELECT elec2_id FROM elective2 WHERE elec2_name = '" + elective2 + "' AND elec2_sec = '" + elective2_sec + "';";
    let elec3_id_query = "SELECT elec3_id FROM elective3 WHERE elec3_name = '" + elective3 + "' AND elec3_sec = '" + elective3_sec + "';";

    db.query(elec2_id_query, (err, result1) => {
      if (err) {
        return res.status(500).send(err);
      }

      db.query(elec3_id_query, (err, result2) => {
        if (err) {
          return res.status(500).send(err);
        }

        let elec2_id, elec3_id;

        if(result1.length == 0){
          elec2_id = null;
        } else {
          elec2_id = result1[0].elec2_id;
        }

        if(result2.length == 0){
          elec3_id = null;
        } else {
          elec3_id = result2[0].elec3_id;
        }

        let query;

        if (elec2_id ==  null){
          query = "UPDATE `instructor` SET `first_name` = '" + f_name + "', `last_name` = '" + l_name + "', `elec2_id` = NULL , `elec3_id` = '" + elec3_id + "' WHERE ins_id = '" + ins_id + "';";
        } else if (elec3_id ==  null) {
          query = "UPDATE `instructor` SET `first_name` = '" + f_name + "', `last_name` = '" + l_name + "', `elec2_id` = '" + elec2_id + "', `elec3_id` = NULL WHERE ins_id = '" + ins_id + "';";
        } else {
          query = "UPDATE `instructor` SET `first_name` = '" + f_name + "', `last_name` = '" + l_name + "', `elec2_id` = '" + elec2_id + "', `elec3_id` = '" + elec3_id + "' WHERE ins_id = '" + ins_id + "';";
        }

        db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.redirect('/instructor');
        });

      });
    });

  },

  deleteInstructor: (req, res) => {

    let ins_id = req.params.id;

    let query = "DELETE FROM `instructor` WHERE ins_id = '" + ins_id + "';";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/instructor');
    });

  },


  // for students
  getStudentList: (req, res) => {

    let year = req.params.year;
    let sec = req.params.sec;

    let query = "SELECT * FROM student WHERE year = '" + year + "' AND sec  = '" + sec + "';";// query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }

      res.render('studentList.ejs', {
        title: 'Elective List',
        students: result,
        year: year,
        sec: sec
      });
    });

  },

  addStudentPage: (req, res) => {
    res.render('addStudent.ejs', {
      title: 'Elective List',
      message: ''
    });
  },

  addStudent: (req, res) => {

    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let year = req.body.year;
    let section = req.body.section;
    let rollno = req.body.rollno;


    let addStudentQuery = "SELECT * FROM `student` WHERE year = '" + year + "' AND sec = '" + section + "' AND stu_id = '" + rollno + "' ";


    db.query(addStudentQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        message = 'Student already exists';
        res.render('addStudent.ejs', {
          message,
          title: 'ELective List'
        });
      } else {


        let query = "INSERT INTO `student` (year, sec, stu_id, first_name, last_name) VALUES ('" +
          year + "', '" + section + "', '" + rollno + "', '" + f_name + "', '" + l_name + "'); "

        db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect(`/${year}/${section}/student`);
        });

      }

    });
  },

  editStudentPage: (req, res) => {

    let stu_id = req.params.id;
    let year= req.params.year;
    let sec = req.params.sec;

    let query = "SELECT * FROM `student` WHERE year = '" + year + "' AND sec = '" + sec + "' AND stu_id = '" + stu_id+ "' ";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.render('editStudent.ejs', {
        title: 'Elective List',
        message: '',
        student: result[0]
      });
    });

  },

  editStudent: (req, res) => {

    let year = req.params.year;
    let section = req.params.sec;
    let stu_id = req.params.id;

    let f_name = req.body.f_name;
    let l_name = req.body.l_name;


    let query1 = "UPDATE `student` SET `first_name` = '" + f_name + "', `last_name` = '" + l_name + "' WHERE year = '" + year + "' AND  sec = '" + section + "' AND stu_id = '" + stu_id + "';";

    db.query(query1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect(`/${year}/${section}/student`);
    });

  },

  deleteStudent: (req, res) => {

    let year = req.params.year;
    let section = req.params.sec;
    let stu_id = req.params.id;

    let query = "DELETE FROM `student` WHERE year = '" + year + "' AND  sec = '" + section + "' AND stu_id = '" + stu_id + "';";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect(`/${year}/${section}/student`);
    });

  },


  //for elective list
  electiveList: (req, res) => {

    let elec_no = req.params.elec_no;
    let section = req.params.sec;

    let query;
    if(elec_no == 2){
      query = "SELECT elective2.elec2_id, elective2.elec2_name, instructor.first_name, instructor.last_name FROM elective2 LEFT JOIN instructor ON elective2.elec2_id = instructor.elec2_id WHERE elective2.elec2_sec = '" + section + "';";
    } else {
      query = "SELECT elective3.elec3_id, elective3.elec3_name, instructor.first_name, instructor.last_name FROM elective3 LEFT JOIN instructor ON elective3.elec3_id = instructor.elec3_id WHERE elective3.elec3_sec = '" + section + "';";
    }

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.render('electiveList.ejs', {
        message: '',
        title: 'ELective List',
        electiveList: result,
        elec_no: elec_no,
        sec: section
      });
    });

  },

  //for final list
  getFinalList: (req, res) => {

    let year = req.params.year;
    let section = req.params.sec;

    // query to find arrays elec2_id_array = ['EX201', 'EX304'] and elec3_id_array = ['BC394']
    let query = "SELECT DISTINCT t.elec2_id FROM (takes AS t LEFT JOIN elective2 AS e2 ON t.elec2_id = e2.elec2_id) WHERE t.year=? AND t.sec=?; "
              + "SELECT DISTINCT t.elec3_id FROM (takes AS t LEFT JOIN elective3 AS e3 ON t.elec3_id = e3.elec3_id) WHERE t.year=? AND t.sec=?;";

    db.query(query, [year, section, year, section], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let elec2_id_array = [], elec3_id_array = [];

      result[0].forEach((e2) => {
        elec2_id_array.push(e2.elec2_id);
      })

      result[1].forEach((e3) => {
        elec3_id_array.push(e3.elec3_id);
      })

      // query to find the necessary details of elective 2 assigned along with student details
      let queryElec2 = "";
      elec2_id_array.forEach((e2) => {
        queryElec2 += "SELECT t.year, t.sec, t.stu_id, t.elec2_id, s.first_name, s.last_name, e2.elec2_name, e2.elec2_sec " +
                      "FROM ((takes AS t LEFT JOIN student AS s ON t.year = s.year AND t.sec = s.sec AND t.stu_id = s.stu_id) " +
  	                  "LEFT JOIN elective2 AS e2 ON t.elec2_id = e2.elec2_id) " +
                      "WHERE t.year = '" + year + "' AND t.sec= '" + section + "' AND t.elec2_id = '" + e2 + "'; ";
                    })

      db.query(queryElec2, (err, result1) => {
        if (err) {
          return res.status(500).send(err);
        }

        // query to find the necessary details of elective 3 assigned along with student details
        let queryElec3 = "";
        elec3_id_array.forEach((e3) => {
          queryElec3 += "SELECT t.year, t.sec, t.stu_id, t.elec3_id, s.first_name, s.last_name, e3.elec3_name, e3.elec3_sec " +
                        "FROM ((takes AS t LEFT JOIN student AS s ON t.year = s.year AND t.sec = s.sec AND t.stu_id = s.stu_id) " +
    	                  "LEFT JOIN elective3 AS e3 ON t.elec3_id = e3.elec3_id) " +
                        "WHERE t.year = '" + year + "' AND t.sec= '" + section + "' AND t.elec3_id = '" + e3 + "'; ";
                      })

        db.query(queryElec3, (err, result2) => {
          if (err) {
            return res.status(500).send(err);
          }

          // query to find the number of students allocated under particular elective 2
          let queryElec2Num = "";
          elec2_id_array.forEach((e2) => {
              queryElec2Num += "SELECT COUNT(DISTINCT t.stu_id) AS num FROM takes AS t LEFT JOIN student AS s ON t.year = s.year AND t.sec = s.sec AND t.stu_id = s.stu_id " +
              "WHERE t.year = '" + year + "' AND t.sec= '" + section + "' AND t.elec2_id = '" + e2 + "'; ";
              })

          db.query(queryElec2Num, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            }

            let elec2_num = [];

            if(result.length == 1){
              result.forEach((r => {
                  elec2_num.push(r.num);
              }))
            } else {
              result.forEach((r => {
                  elec2_num.push(r[0].num);
              }))
            }

            let elec2_obj =  elec2_num.reduce(function(result, field, index) {
                result[elec2_id_array[index]] = field;
                return result;
              }, {});

              // query to find the number of students allocated under particular elective 3
              let queryElec3Num = "";
              elec3_id_array.forEach((e3) => {
                  queryElec3Num += "SELECT COUNT(DISTINCT t.stu_id) AS num FROM takes AS t LEFT JOIN student AS s ON t.year = s.year AND t.sec = s.sec AND t.stu_id = s.stu_id " +
                  "WHERE t.year = '" + year + "' AND t.sec= '" + section + "' AND t.elec3_id = '" + e3 + "'; ";
                  })

              db.query(queryElec3Num, (err, result) => {
                if (err) {
                  return res.status(500).send(err);
                }

                let elec3_num = [];
                if(result.length == 1){
                  result.forEach((r => {
                      elec3_num.push(r.num);
                  }))
                } else {
                  result.forEach((r => {
                      elec3_num.push(r[0].num);
                  }))
                }

                let elec3_obj =  elec3_num.reduce(function(result, field, index) {
                    result[elec3_id_array[index]] = field;
                    return result;
                  }, {});


                  let elec2 = [], elec3 = [];

                  // check if the array is nested
                  if (!Array.isArray(result1[0])){
                    result1.forEach((r1, index) => {
                      elec2.push(r1);
                    })
                  } else {
                    for(let i=0; i< result1.length; i++){
                    result1[i].forEach((r1, index) => {
                      elec2.push(r1);
                    })
                  }
                  }

                  // check if the array is nested
                  if (!Array.isArray(result2[0])){
                    result2.forEach((r2, index) => {
                      elec3.push(r2);
                    })
                  } else {
                    for(let i=0; i< result2.length; i++){
                      result2[i].forEach((r2, index) => {
                        elec3.push(r2);
                    })
                  }
                  }

                  let elec2_array_k = Object.keys(elec2_obj);
                  let elec3_array_k = Object.keys(elec3_obj);
                  let elec2_array_v = Object.values(elec2_obj);
                  let elec3_array_v = Object.values(elec3_obj);

                  // console.log('--------elec2-----------');
                  // console.log(elec2_obj);
                  // console.log(elec2);
                  // console.log('-------elec3------------');
                  // console.log(elec3_obj);
                  // console.log(elec3);

                  let elec2_suff = [], elec2_not_suff = [];

                  for(let i=0; i<elec2_array_v.length; i++){
                    if (elec2_array_v[i] > 11) {
                      elec2_suff.push(elec2_array_k[i]);
                    } else {
                      elec2_not_suff.push(elec2_array_k[i]);
                    }
                  }

                  let elec3_suff = [], elec3_not_suff = [];

                  for(let i=0; i<elec3_array_v.length; i++){
                    if (elec3_array_v[i] > 11) {
                      elec3_suff.push(elec3_array_k[i]);
                    } else {
                      elec3_not_suff.push(elec3_array_k[i]);
                    }
                  }

                  res.render('finalList.ejs', {
                    message: '',
                    title: 'ELective List (Final)',
                    elec2_obj: elec2_obj,
                    elec3_obj: elec3_obj,
                    elec2_array: elec2_array_k,
                    elec3_array: elec3_array_k,
                    elec2_len: result1.length,
                    elec3_len: result2.length,
                    elec2: elec2,
                    elec3: elec3,
                    elec2_suff: elec2_suff,
                    elec2_not_suff: elec2_not_suff,
                    elec3_suff: elec3_suff,
                    elec3_not_suff: elec3_not_suff,
                    year: year,
                    section: section
                  });

              });
          });

        });

      });

    });

  },


};
