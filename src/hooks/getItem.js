export function getItemInDataById(array, id) {
    return array.find((el) => el.id == id )
}

export function getItemInDocById(id) {
    return document.querySelector(`.main .todo__item[todo-id='${id}']`);
}