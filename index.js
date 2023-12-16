const itemForm = document.querySelector('#item-form')
const itemInput = document.querySelector('#item-input')
const ul = document.querySelector('#item-list')
const clearBtn = document.querySelector('#clear')
const filter = document.querySelector('.filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false;



// The above  variable are the Form, the input and the Unorder lis we are going to work on to add new item, they are stored in the global variable so we can access them anywhere 

// Display elements from tthe local session storage to screen

function displayUI (){
    let fromLocalStorage = getItemsfromStorage()

    fromLocalStorage.forEach(item => addItemDoM(item))

    checkUI()
}




function onSubmit (e){
    e.preventDefault()
     /* we use epreventdefault to not  let the form submit to the page*/

    const newInput = itemInput.value
    if(newInput === ''){
        alert('Please fill in the input')
        return
    }

    // check for edit mode
    if (isEditMode){
    const itemToEdit = ul.querySelector('.edit-mode')

    removeItemFromStorage(itemToEdit.textContent)
    itemToEdit.classList.remove('edit-mode')
    itemToEdit.remove()

    isEditMode = false;
      } else {
    if (checkIfItemExists(newInput)){
        alert('item already exists')
        return;
    }
}
    // create item dom element
    addItemDoM(newInput)

    // add item to localstorage
    addItemToStorage(newInput)
    

    checkUI()
    itemInput.value = ''
}


// This is where we add items to DOM

function addItemDoM(item){
    const li = document.createElement('li')
    const text = document.createTextNode(item)
    li.appendChild(text)
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    ul.appendChild(li)
}

 

// we create a new button element with class
function createButton(classes){
    const button = document.createElement('button')
    button.className = classes;
   const icon =  createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button ;
}

// we create a new icon elemnet with class
function createIcon (classes){
    const icon = document.createElement('i')
    icon.className = classes;
    return icon
}

// This is where we add items to storage

function addItemToStorage (item){

   const fromLocalStorage = getItemsfromStorage();

      fromLocalStorage.push(item)
    // convert item to stringify
    localStorage.setItem('items', JSON.stringify(fromLocalStorage))

    
 }

 function getItemsfromStorage (){
    let fromLocalStorage;

    if (localStorage.getItem('items') === null){
        fromLocalStorage = [];
    } else {
        fromLocalStorage = JSON.parse(localStorage.getItem('items'))
    }
  
   return fromLocalStorage;
    
 }
//  How to remove items from thr list and how to clear all items from the button

function onClickItem(e){
    if (e.target.parentElement.classList.contains('btn-link')){
         removeItem(e.target.parentElement.parentElement) 
    } else {
        setItemEdit(e.target)
    }

   
}

function checkIfItemExists (item){
    const fromLocalStorage = getItemsfromStorage()

   return fromLocalStorage.includes(item)
    
}

function setItemEdit(item){
    isEditMode = true;

    ul.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))
    
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent

   
}


function removeItem(item){

    if(confirm ('Are you sure')){
        // Remove item from DOM
        item.remove()

        // Remove item from storage
        removeItemFromStorage(item.textContent)

        checkUI()
    }
    
}

function removeItemFromStorage(item){
    let fromLocalStorage = getItemsfromStorage()

    // filter out item to be removed 

    fromLocalStorage = fromLocalStorage.filter((i) => i !== item)
    // Reset to localstorage 
    localStorage.setItem('items', JSON.stringify(fromLocalStorage))
}

function removeItemsList(){
    while(ul.firstChild){
        ul.removeChild(ul.firstChild)
    }
    // clear from local storage
    localStorage.removeItem('items')
    checkUI()
}
// This where we try to mimick the items getting the items from filter through their index
function filterItems(e){
    const list = ul.querySelectorAll('li')
    const text = e.target.value.toLowerCase()

    list.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase()
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
    })

}
// we check to see if there is nothing in the list that the clearAll btn and filter should dissapear
 function checkUI (){
    itemInput.value = '';
    const list = ul.querySelectorAll('li')
 if (list.length === 0){
    clearBtn.style.display = 'none'
    filter.style.display = 'none'
 } else {
    clearBtn.style.display = 'block'
    filter.style.display = 'block'
 }

formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
 formBtn.style.backgroundColor = '#333'
 isEditMode = false;
 }


  


   function init(){
   itemForm.addEventListener('submit', onSubmit)
    ul.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', removeItemsList)
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayUI)
    checkUI()
   }

   init()