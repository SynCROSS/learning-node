// const axios = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/axios');
const getUser = async () => {
  try {
    const res = await axios.get('/users');
    const users = res.data;
    const list = document.getElementById('list');
    list.innerHTML = '';

    Object.keys(users).map(key => {
      const userDiv = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = users[key];
      const edit = document.createElement('button');
      edit.textContent = 'Edit';
      edit.addEventListener('click', async () => {
        const name = prompt('Type the name to change');
        if (!name) {
          return alert('You must type it!');
        }
        try {
          await axios.put('/user/' + key, { name });
          getUser();
        } catch (e) {
          console.error(e);
        }
      });
      const remove = document.createElement('button');
      remove.textContent = 'Delete';
      remove.addEventListener('click', async () => {
        try {
          await axios.delete('/user/' + key);
          getUser();
        } catch (e) {
          console.error(e);
        }
      });
      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
      console.log(res.data);
    });
  } catch (e) {
    console.error(e);
  }
};

window.onload = getUser;

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = e.target.username.value;
  if (!name) {
    return alert('Type the name!');
  }
  try {
    await axios.post('/user', { name });
    getUser();
  } catch (e) {
    console.error(e);
  }
  e.target.username.value = '';
});
