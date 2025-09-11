let dataItems = [
  "Alpha",
  "Beta",
  "Gamma",
];

loadItems();
showItems();
prepareForm();
prepareList();
watchStorage();

function watchStorage() {
  onstorage = e => {
    if (e.key === "dataItems") {
      loadItems();
      showItems();
    }
  }
}

function loadItems() {
  const json = localStorage.getItem("dataItems");

  if (json) dataItems = JSON.parse(json);
}

function saveItems() {
  const newLocal = JSON.stringify(dataItems);

  localStorage.setItem("dataItems", newLocal);
}

function prepareForm() {
  const form = document.querySelector("form");

  form.onsubmit = handleSubmitNew;
}

function prepareList() {
  const list = document.querySelector("ul");

  list.onclick = handleItemClick;
  list.onmouseout = handleMouseBlur;
}

function handleMouseBlur(e) {
  const btn = e.target.closest("button");

  if (!btn) return;

  btn.blur();
}

function handleSubmitNew(e) {
  const form = e.target;
  const str = form.item.value;

  addItem(str);
  saveItems();
  showItems();

  form.reset();
}

function handleItemClick(e) {
  const btn = e.target.closest("button");

  if (!btn) return;

  const li = btn.closest("li");
  const i = getIndex(li);

  if (i === -1) return;

  if (btn.matches(".edit")) {
    showItems();
    allowEdit(i);
  }

  if (btn.matches(".delete")) {
    deleteItem(i);
    saveItems();
    showItems();
  }
}

function getIndex(li) {
  const ul = li.closest("ul");
  const items = Array.from(ul.children);

  return items.indexOf(li);
}

function deleteItem(i) {
  dataItems.splice(i, 1);
}

function addItem(str) {
  dataItems.push(str);
}

function allowEdit(i) {
  const ul = document.querySelector("ul");
  const li = ul.children[i];
  const str = dataItems[i];
  const form = buildEditForm(str);

  li.replaceChildren(form);
}

function showItems() {
  const ul = document.querySelector("ul");
  const listItems = dataItems.map(buildItem);

  ul.replaceChildren(...listItems);
}

function buildItem(str) {
  const li = document.createElement("li");
  const editBtn = document.createElement("button");
  const delBtn = document.createElement("button");

  li.append(str, ' ', editBtn, ' ', delBtn);
  editBtn.append('edit');
  editBtn.classList.add('edit');
  delBtn.append('delete');
  delBtn.classList.add('delete');

  return li;
}

function buildEditForm(str) {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const saveBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");

  form.action = "javascript:";
  form.onsubmit = handleSubmitRename;
  form.append(input, ' ', saveBtn, ' ', cancelBtn);
  input.value = str;
  input.name = "item";
  saveBtn.append('save');
  saveBtn.classList.add('save');
  cancelBtn.append('cancel');
  cancelBtn.classList.add('cancel');

  return form;
}

function handleSubmitRename(e) {
  const form = e.target;
  const btn = e.submitter;
  const str = form.item.value;
  const li = form.closest("li");
  const i = getIndex(li);

  if (btn.matches(".save")) {
    updateItem(i, str);
    saveItems();
    showItems();
  }

  if (btn.matches(".cancel")) {
    showItems();
  }
}

function updateItem(i, str) {
  dataItems[i] = str;
}
