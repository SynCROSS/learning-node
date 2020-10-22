// * Load Comments When User Name is Pressed
document.querySelectorAll('#user-list tr').forEach(el => {
  el.addEventListener('click', function () {
    const id = el.querySelector('td').textContent;
    getComment(id);
  });
});
// * Load User
async function getUser() {
  try {
    const res = await axios.get('/users');
    const users = res.data;
    console.log(users);
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    users.map(function (user) {
      const row = document.createElement('tr');
      row.addEventListener('click', () => {
        getComment(user._id);
      });
      // * Add Row Cell
      let td = document.createElement('td');
      td.textContent = user._id;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.name;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.age;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = user.married ? 'Married' : 'Single';
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}
// * Load Comments
async function getComment(id) {
  try {
    const res = await axios.get(`/users/${id}/comments`);
    const comments = res.data;
    const tbody = document.querySelector('#comment-list tbody');
    tbody.innerHTML = '';
    comments.map(function (comment) {
      // * Add Row Cell
      const row = document.createElement('tr');
      let td = document.createElement('td');
      td.textContent = comment._id;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = comment.commenter.name;
      row.appendChild(td);
      td = document.createElement('td');
      td.textContent = comment.comment;
      row.appendChild(td);
      const edit = document.createElement('button');
      edit.textContent = 'Edit';
      edit.addEventListener('click', async () => {
        // * Click 'Edit'
        const newComment = prompt('Please Enter What You Want to Replace.');
        if (!newComment) {
          return alert('You Must Enter the Contents.');
        }
        try {
          await axios.patch(`/comments/${comment._id}`, {
            comment: newComment,
          });
          getComment(id);
        } catch (error) {
          console.error(error);
        }
      });
      const remove = document.createElement('button');
      remove.textContent = 'Delete';
      remove.addEventListener('click', async () => {
        // * Click 'Delete'
        try {
          await axios.delete(`/comments/${comment._id}`);
          getComment(id);
        } catch (error) {
          console.error(error);
        }
      });
      // * Add Button
      td = document.createElement('td');
      td.appendChild(edit);
      row.appendChild(td);
      td = document.createElement('td');
      td.appendChild(remove);
      row.appendChild(td);
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}
// * Add User
document.getElementById('user-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value;
  const married = e.target.married.checked;
  if (!name) {
    return alert('Please Enter the Name.');
  }
  if (!age) {
    return alert('Please Enter the Age.');
  }
  try {
    await axios.post('/users', { name, age, married });
    getUser();
  } catch (error) {
    console.error(error);
  }
  e.target.username.value = '';
  e.target.age.value = '';
  e.target.married.checked = false;
});
// * Add Comments
document.getElementById('comment-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = e.target.userId.value;
  const comment = e.target.comment.value;
  if (!id) {
    return alert('Please Enter the ID.');
  }
  if (!comment) {
    return alert('Please Enter the Comments');
  }
  try {
    await axios.post('/comments', { id, comment });
    getComment(id);
  } catch (error) {
    console.error(error);
  }
  e.target.userId.value = '';
  e.target.comment.value = '';
});
