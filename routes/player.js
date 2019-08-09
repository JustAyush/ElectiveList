const fs = require('fs');

module.exports = {

  // for instructor
  addInstructorPage: (req, res) => {
    res.render('addInstructor.ejs', {
      title: 'Elective List',
      message: ''
    });
  },

  addInstructor: (req, res) => {

    let ins_name = req.body.instructor_name;

    let addInstructorQuery = "INSERT INTO `instructor` (name) VALUES ('" +
      ins_name + "')";

    db.query(addInstructorQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.redirect('/');
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

    console.log(ins_id);


    if (course_name == 'DBMS') {
      course_id = 100;
    } else if (course_name == 'EADD') {
      course_id = 200;
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
          res.redirect('/');
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

    console.log(section);

    let ins_id = parseInt(ins_name);

    console.log(courseId);

    let query = "UPDATE `assigncourse` SET `ins_id` = '" + ins_id + "', `sec_id` = '" + section + "', `ele_id` = '" + elective_no + "' WHERE id = '" + courseId + "'";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
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

    let courseId = req.params.id;
    console.log(courseId);

    let query = 'SELECT student.name, student.stu_id, takes.sec_id FROM `student` ' +
      'INNER JOIN `takes` ' +
      'ON student.stu_id = takes.id ' +
      'WHERE takes.course_id = "' + courseId + '" ' +
      'ORDER BY student.name ASC'; // query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }
      console.log(result);
      console.log("----------------------------");

      res.render('studentList.ejs', {
        title: 'Elective List',
        students: result,
        course_id: courseId
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
    let courseId = req.params.id;


    let message = '';

    let name = req.body.name;
    let rollno = req.body.rollno;
    let section = req.body.section;


    let addStudentQuery = "SELECT * FROM `student` WHERE stu_id = '" + rollno + "'";

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

        let query1 = "SELECT * FROM `assigncourse` WHERE id = '" + courseId + "'";

        db.query(query1, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          console.log(result);
          let ele_id = result[0].ele_id;
          console.log(ele_id);

          let query2 = "INSERT INTO `student` (stu_id, name) VALUES ('" +
            rollno + "', '" + name + "'); " +
            "INSERT INTO `takes` (id, course_id, sec_id, ele_id) VALUES ('" +
            rollno + "', '" + courseId + "','" + section + "','" + ele_id + "')"

          db.query(query2, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            }
            res.redirect('/');
          });

        });


      }

    });
  },

  editStudentPage: (req, res) => {

    let courseId = req.params.id;
    let studentId = req.params.id2;

    res.render('editStudent.ejs', {
      title: 'Elective List',
      message: ''
    });
  },

  editStudent: (req, res) => {

    let courseId = req.params.id;
    let studentId = req.params.id2;

    let name = req.body.name;
    let section = req.body.section;

    let query1 = "UPDATE `student` SET `name` = '" + name + "' WHERE stu_id = '" + studentId + "'";

    db.query(query1, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

    let query2 = "UPDATE `takes` SET `sec_id` = '" + section + "' WHERE id = '" + studentId + "'";
    db.query(query2, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
      });
    });

  },




};
