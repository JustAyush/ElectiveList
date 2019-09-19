const fs = require('fs');

module.exports = {

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

  editInstructorPage: (req, res) => {

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

        res.render('editInstructor.ejs', {
          title: 'Elective List',
          message: '',
          elective2: elective2_list,
          elective3: elective3_list,
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

  // for courses
  addPlayerPage: (req, res) => {

    let listInstructor = 'SELECT * FROM `instructor`';

    db.query(listInstructor, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let ins_list = result;

      res.render('add-player.ejs', {
        title: 'Elective List',
        ins_list: ins_list,
        message: ' '
      });
    });


  },

  addCourse: (req, res) => {
    // if (!req.files) {
    //     return res.status(400).send("No files were uploaded.");
    // }

    let message = '';

    let course_name = req.body.course_name;
    let instructor_name = req.body.instructor_name;
    let section = req.body.section_name;
    let elective_no = req.body.elective_no;
    let ins_id;

    // getting 13 from '13 Aman Shakya'
    // let b = '';
    // for(let i=0; i<instructor_name.length; i++){
    //   if(instructor_name[i]!=' '){
    //     b += instructor_name[i];
    //   } else {
    //     break;
    //   }
    // }
    ins_id = parseInt(instructor_name);

    if (course_name == 'DBMS') {
      course_id = 100;
    } else if (course_name == 'EADD') {
      course_id = 250;
    } else if (course_name == 'AI') {
      course_id = 300;
    } else {
      course_id = 400;
    }

    let coursetitleQuery = "SELECT * FROM `course` WHERE title = '" + course_name + "' ";

    db.query(coursetitleQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        message = 'Course already exists';
        res.render('add-player.ejs', {
          message,
          title: 'ELective List'
        });
      } else {

        let query = "INSERT INTO `course` (course_id, title) VALUES ('" +
          course_id + "', '" + course_name + "'); " +
          " INSERT INTO `assigncourse` (id, ele_id, sec_id, ins_id) VALUES ('" +
          course_id + "', '" + elective_no + "', '" + section + "', '" + ins_id + "') ";

        db.query(query, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect('/getHomepage');
        });

      }

    });
  },


  editPlayerPage: (req, res) => {

    let courseId = req.params.id;

    let query = "SELECT * FROM `course` WHERE course_id = '" + courseId + "' ";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      let listInstructor = 'SELECT * FROM `instructor`';

      db.query(listInstructor, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        let ins_list = result;

        res.render('edit-player.ejs', {
          title: 'Edit Course',
          course: result[0],
          ins_list: ins_list,
          message: ''
        });
      });

    });
  },

  editPlayer: (req, res) => {

    let courseId = req.params.id;
    let ins_name = req.body.instructor_name;
    let section = req.body.section_name;
    let elective_no = req.body.elective_no;

    let ins_id = parseInt(ins_name);

    let query = "UPDATE `assigncourse` SET `ins_id` = '" + ins_id + "', `sec_id` = '" + section + "', `ele_id` = '" + elective_no + "' WHERE id = '" + courseId + "'";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/getHomepage');
    });
  },

  deletePlayer: (req, res) => {

    let courseId = req.params.id;
    let deleteUserQuery = 'DELETE FROM course WHERE course_id = "' + courseId + '"';

    db.query(deleteUserQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
    });

  },

  // for students

  getStudentList: (req, res) => {

    let query = 'SELECT * FROM student;';// query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }

      res.render('studentList.ejs', {
        title: 'Elective List',
        students: result
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
          res.redirect('/student');
        });

      }

    });
  },

  editStudentPage: (req, res) => {

    res.render('editStudent.ejs', {
      title: 'Elective List',
      message: ''
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
      res.redirect('/student');
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
      res.redirect('/student');
    });

  },



};
