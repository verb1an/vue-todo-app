<template>
    <main class="main" @mousemove="mouseMove" @mouseup="delDragObject">
        <div class="wrapper">
            <div
                v-for="todo in todoList"
                :key="todo.id"
                :todo-id="todo.id"
                :style="`top: ${todo.position.y}px; left: ${todo.position.x}px; z-index: ${todo.position.z};`"
                class="todo__item component"
                :class="todo.lock ? 'lock' : ''"
                :menu-toggle="todo.menuToggle ? 'open' : 'hide'"
                @mouseup="setToTopItem"
                @click="addNewArrow"
                @mouseenter="mouseenterMaybeSetElement"
                @mouseleave="mouseleaveMaybeSetElement"
            >
                <div class="todo__item_wrapper">
                    <div class="todo__item_head">
                        <span class="draggble" @mousedown="setDragObject"></span>

                        <app-button type="button" class="menu__toggle" @click="setItemMenuPosition">
                            <span class="line"></span>
                            <span class="line"></span>
                            <span class="line"></span>
                        </app-button>

                        <div class="todo__item_menu" :menu-toggle="todo.menuToggle ? 'open' : 'hide'">
                            <ul class="list">
                                <li class="list__item">
                                    <app-button type="button" @click="arrowModeSetter">
                                        <span class="i-expand-from-corner" style="transform: translateY(-2px)"></span>
                                    </app-button>
                                </li>
                                <li class="list__item">
                                    <app-button type="button">
                                        <span class="i-file"></span>
                                    </app-button>
                                </li>
                                <li class="list__item">
                                    <app-button type="button" @click="setLockItem">
                                        <span class="i-lock"></span>
                                    </app-button>
                                </li>
                                <li class="list__item">
                                    <app-button type="button" @click="addNewTodoList">
                                        <span class="i-list-ul"></span>
                                    </app-button>
                                </li>
                                <li class="list__item">
                                    <app-button type="button" @click="showDeleteDiolog">
                                        <span class="i-trash-alt"></span>
                                    </app-button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="todo__item_body">
                        <div class="title">
                            <app-todo-input v-model="todo.title" :placeholder="'Title'" class="title" />
                        </div>

                        <div class="text">
                            <div v-for="n in todo.text.length" :key="n" class="text__item">
                                <app-todo-text
                                    v-if="typeof todo.text[n - 1] == 'string'"
                                    v-model="todo.text[n - 1]"
                                    :placeholder="'Напишите что-нибудь...'"
                                    class="default"
                                />
                                <app-todo-list
                                    v-else
                                    :content="todo.text[n - 1]"
                                    :itemId="todo.id"
                                    :listCount="n - 1"
                                    @todo:changeStatus="changeStatusTodoItem"
                                    @todo:addItem="addNewTodoItem"
                                    @todo:removeItem="removeTodoItem"
                                    @input:blur="removeFocusTodoItemInput"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <span v-if="todo.lock" class="locked__status i-lock"></span>
            </div>

            <svg id="area" viewbox="0 0 1600 900"></svg>

            <div v-if="todoList.length < 1" class="items__none">
                <h3>Привет)) Как у тебя дела?</h3>
                <app-button type="button" class="items__none_button" @click="addNewItem">
                    <span class="i-plus"></span>
                    <span>Нажми на меня</span>
                </app-button>
            </div>
        </div>

        <app-items-list
            v-if="todoList.length > 0"
            :items="todoList"
            @item:hover="hoverFocusedItem"
            @item:blur="blurFocusedItem"
            @item:add="addNewItem"
        />
        <app-modal-window-success
            @func:success="deleteQuestion"
            :content="successItem"
            @modal:close="modalJustClose"
            @modal:success="modalDoIt"
        />

        <div class="textAreaHeightResize"></div>
    </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getItemInDocById, getItemInDataById } from "@/hooks/getItem";

const todoList = ref([]);
const arrows = ref([]);

const successItem = ref({
    show: false,
    message: "",
    func: null,
    btn: {
        yes: "",
        no: "",
    },
});

let dragObject = null;
let arrowMode = ref(false);
let arrowModeItems = ref({
    firstItem: null,
    secondItem: null,
});
let arrowObject = ref(null);

// <!-- ? item movement -->

const mouseX = ref(0);
const mouseY = ref(0);

const offsetItemX = ref(0);
const offsetItemY = ref(0);

function mouseMove(event) {
    event = fixEvent(event);
    mouseX.value = event.pageX;
    mouseY.value = event.pageY;

    if (dragObject) {
        setPosToItem(dragObject, mouseX.value, mouseY.value, offsetItemX.value, offsetItemY.value);
    }

    if (arrowMode.value === true) {
        document.querySelector(".arrowModeSecondItem").style = `position: absolute; width: 2px; height: 2px;top: ${
            mouseY.value - 5
        }px; left: ${mouseX.value - 5}px; pointer-events: none;`;
        redrawArrows(null, arrows.value);
    }
}

function setPosToItem(dragObject, mouseX, mouseY, offsetItemX, offsetItemY) {
    const todoItem = getItemInDataById(todoList.value, dragObject.getAttribute("todo-id"));
    if (todoItem.lock) return;

    todoItem.position.x = mouseX - offsetItemX;
    // <!-- ? For not moving bottom them max -->
    if (mouseY + dragObject.getBoundingClientRect().height / 3 < window.innerHeight && mouseY > 20) {
        todoItem.position.y = mouseY - offsetItemY;
    }

    redrawArrows(dragObject, arrows.value);
}

function fixEvent(event) {
    event = event || window.event;

    if (event.pageX == null && event.clientX != null) {
        let html = document.documentElement;
        let body = document.body;

        event.pageX =
            event.clientX + ((html && html.scrollLeft) || (body && body.scrollLeft) || 0) - (html.clientLeft || 0);
        event.pageY =
            event.clientY + ((html && html.scrollTop) || (body && body.scrollTop) || 0) - (html.clientTop || 0);
    }

    if (!event.which && event.button) {
        event.which = event.button & 1 ? 1 : event.button & 2 ? 3 : event.button & 4 ? 2 : 0;
    }

    return event;
}

function setDragObject(event) {
    dragObject = event.target.closest(".todo__item");
    offsetItemX.value = mouseX.value - dragObject.getBoundingClientRect().left;
    offsetItemY.value = mouseY.value - dragObject.getBoundingClientRect().top;
    dragObject.classList.add("drag");
    document.body.onselectstart = function () {
        return false;
    };
}

function delDragObject() {
    if (dragObject) {
        dragObject.classList.remove("drag");
        dragObject = null;
        document.body.onselectstart = function () {};
    }
}

function setToTopItem(event) {
    if (getItemInDataById(todoList.value, event.target.closest(".todo__item").getAttribute("todo-id")).lock) return;

    getItemInDataById(todoList.value, event.target.closest(".todo__item").getAttribute("todo-id")).position.z = 100;
    let missArr = [];
    todoList.value.forEach((el, i) => {
        missArr.push({
            index: i,
            z: el.position.z,
        });
    });
    missArr = missArr.sort((prev, next) => prev.z - next.z);
    missArr.forEach((el, i) => {
        el.z = i + 10;
        todoList.value[el.index].position.z = el.z;
    });
}

// <!-- ? Item functional -->

function addNewItem() {
    todoList.value.push({
        id: crypto.randomUUID(),
        title: "Title",
        text: ["Пустая строка"],
        position: {
            x: window.innerWidth / 2 - 200,
            y: window.innerHeight / 2 - 200,
            z: 100,
        },
        menuToggle: false,
        lock: false,
    });
}

function deleteItem(id) {
    todoList.value.forEach((el, index) => {
        if (el.id === id) todoList.value.splice(index, 1);
    });

    arrows.value.forEach((el, index) => {
        if(el.firstItem === id || el.secondItem === id) {
            arrows.value.splice(index, 1);
            document.getElementById("area").innerHTML = '';
            arrows.value.forEach((el) => {
                setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
            });
        }
    })
}

function showDeleteDiolog(event) {
    successItem.value = {
        show: true,
        message: "Удалить этот пин?",
        func: {
            type: "item:delete",
            id: event.target.closest(".todo__item").getAttribute("todo-id"),
        },
        btn: {
            yes: "Удалить",
            no: "Отмена",
        },
    };
}

function setLockItem(event) {
    const todoItem = getItemInDataById(todoList.value, event.target.closest(".todo__item").getAttribute("todo-id"));
    todoItem.lock = !todoItem.lock;
    todoItem.menuToggle = false;
}

// <!-- ? Modal Window functional -->

function modalJustClose() {
    successItem.value = {
        show: false,
        message: "",
        func: null,
        btn: {
            yes: "",
            no: "",
        },
    };
}

function modalDoIt(content) {
    if (content.type === "item:delete") {
        deleteItem(content.id);
    }
    modalJustClose();
}

// <!-- ? Todo -->
function addNewTodoList(event) {
    const item = getItemInDataById(todoList.value, event.target.closest(".todo__item").getAttribute("todo-id"));
    item.text.push([
        {
            id: 1,
            text: "",
            status: false,
        },
    ]);
    item.text.push("");
}

function changeStatusTodoItem(status) {
    let item = getItemInDataById(todoList.value, status.itemId);
    getItemInDataById(item.text[status.listCount], status.todoId).status = !getItemInDataById(
        item.text[status.listCount],
        status.todoId
    ).status;
}

function addNewTodoItem(status) {
    const list = getItemInDataById(todoList.value, status.itemId).text[status.listCount];

    let itt = list.reduce(function (acc, curr) {
        if (acc.id > curr.id) return acc;
        else return curr;
    });

    list.splice(list.findIndex((el) => el.id == status.todoId) + 1, 0, {
        id: itt.id + 1,
        text: "",
        status: false,
        focus: true,
    });
}

function removeTodoItem(status) {
    const item = getItemInDataById(todoList.value, status.itemId);
    const list = item.text[status.listCount];
    list.splice(
        list.findIndex((el) => el.id == status.todoId),
        1
    );

    if (!list.length) {
        if (typeof item.text[status.listCount - 1] === "string") {
            if (typeof item.text[status.listCount + 1] === "string") {
                item.text[status.listCount - 1] += item.text[status.listCount + 1];
                item.text.splice(status.listCount + 1, 1);
            }
        } else {
            if (typeof item.text[status.listCount + 1] !== "string") {
                item.text.splice(status.listCount - 1, 0, "");
            }
        }

        item.text.splice(status.listCount, 1);
    }
}

function removeFocusTodoItemInput(status) {
    const list = getItemInDataById(todoList.value, status.itemId).text[status.listCount];
    list[list.findIndex((el) => el.id == status.todoId)].focus = false;
}

// <!-- ? Arrows -->

function setArrows(arrow, fi, si) {
    const firstItem = fi.getBoundingClientRect();
    const secondItem = si.getBoundingClientRect();

    const firstItemXcenter = firstItem.left + firstItem.width / 2,
        firstItemYcenter = firstItem.top + firstItem.height / 2,
        secondItemXcenter = secondItem.left + secondItem.width / 2,
        secondItemYcenter = secondItem.top + secondItem.height / 2;

    let startArrow = { x: 0, y: 0 };
    let endArrow = { x: 0, y: 0 };

    let offsetFirstItemX = 0;
    let offsetFirstItemY = 0;
    let offsetSecondItemX = 0;
    let offsetSecondItemY = 0;

    if (Math.abs(firstItemXcenter - secondItemXcenter) > Math.abs(firstItemYcenter - secondItemYcenter)) {
        offsetFirstItemX = firstItem.width / 2;
        offsetFirstItemY = firstItem.height / 4;
        offsetSecondItemX = secondItem.width / 2;
        offsetSecondItemY = secondItem.height / 4;

        if (Math.abs(firstItemYcenter - secondItemYcenter) < 100) {
            offsetFirstItemY = 0;
            offsetSecondItemY = 0;
        }
    } else {
        offsetFirstItemX = firstItem.width / 4;
        offsetFirstItemY = firstItem.height / 2;
        offsetSecondItemX = secondItem.width / 4;
        offsetSecondItemY = secondItem.height / 2;
    }

    if (firstItemXcenter > secondItemXcenter) {
        // <!-- * 2nd item left side -->
        startArrow.x = firstItemXcenter - offsetFirstItemX;
        endArrow.x = secondItemXcenter + offsetSecondItemX;
    } else {
        // <!-- * 2nd item right side -->
        startArrow.x = firstItemXcenter + offsetFirstItemX;
        endArrow.x = secondItemXcenter - offsetSecondItemX;
    }

    if (firstItemYcenter > secondItemYcenter) {
        // <!-- * 2nd item top -->
        startArrow.y = firstItemYcenter - offsetFirstItemY;
        endArrow.y = secondItemYcenter + offsetSecondItemY;
    } else {
        // <!-- * 2nd item bottom -->
        startArrow.y = firstItemYcenter + offsetFirstItemY;
        endArrow.y = secondItemYcenter - offsetSecondItemY;
    }

    const docArrow = document.querySelector(`#area g[arrow-id='${arrow.id}']`);
    if (!docArrow) {
        document.getElementById("area").innerHTML += `
            <g arrow-id='${arrow.id}' class="arrow__line">
                <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 5 2, 0 4" />
                    </marker>
                </defs>
                <line class="line__main" x1="${startArrow.x}" y1="${startArrow.y}" x2="${endArrow.x}" y2="${endArrow.y}" stroke-width="3" marker-end="url(#arrowhead)" />
            </g>
        `;
    } else {
        docArrow.querySelector(".line__main").setAttribute("x1", startArrow.x);
        docArrow.querySelector(".line__main").setAttribute("y1", startArrow.y);
        docArrow.querySelector(".line__main").setAttribute("x2", endArrow.x);
        docArrow.querySelector(".line__main").setAttribute("y2", endArrow.y);
    }
}

function redrawArrows(dragObject, arrows) {
    if (arrowMode.value === true) {
        setArrows(arrows.at(-1), getItemInDocById(arrows.at(-1).firstItem), arrows.at(-1).secondItem);
        return;
    }

    const todoItem = getItemInDataById(todoList.value, dragObject.getAttribute("todo-id"));
    arrows.forEach((el) => {
        if (todoItem.id == el.firstItem || todoItem.id == el.secondItem) {
            setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
        }
    });
}

function arrowModeSetter(event) {
    arrowMode.value = true;
    const secondArrowModeItem = document.createElement("div");
    secondArrowModeItem.className = "arrowModeSecondItem";
    document.querySelector(".main").append(secondArrowModeItem);

    arrowModeItems.value.firstItem = event.target.closest(".todo__item");
    arrowModeItems.value.secondItem = secondArrowModeItem;

    arrows.value.push({
        id: crypto.randomUUID(),
        firstItem: event.target.closest(".todo__item").getAttribute("todo-id"),
        secondItem: secondArrowModeItem,
    });

    setArrows(arrows.value.at(-1), getItemInDocById(arrows.value.at(-1).firstItem), arrows.value.at(-1).secondItem);

    getItemInDataById(todoList.value, event.target.closest(".todo__item").getAttribute("todo-id")).menuToggle = false;
}

function addNewArrow(event) {
    if (!arrowMode.value) return;

    if (event.target.closest(".todo__item")) {
        const item = event.target.closest(".todo__item");
        if (item.getAttribute("todo-id") === arrows.value.at(-1).firstItem) return;

        arrows.value.at(-1).secondItem = item.getAttribute("todo-id");

        arrowMode.value = false;
        arrowModeItems.value.firstItem = null;
        arrowModeItems.value.secondItem = null;

        document.querySelector(".arrowModeSecondItem").remove();
    }

    arrows.value.forEach((el) => {
        setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
    });
}

// <!-- ? Item menu position -->
function setItemMenuPosition(event) {
    let menuType = "menu";
    const item = event.target.closest(".todo__item");
    const itemMenu = getItemInDataById(todoList.value, item.getAttribute("todo-id"));
    itemMenu.menuToggle = !itemMenu.menuToggle;

    if (window.innerWidth - item.getBoundingClientRect().right < 180) {
        menuType += "-left";
    } else {
        menuType += "-right";
    }
    if (item.getBoundingClientRect().top < 120) {
        menuType += "-bottom";
    } else {
        menuType += "-top";
    }

    item.setAttribute("menu-type", menuType);

    const listener = (event) => {
        if (!event.target.closest(".todo__item")) {
            if (event.target.closest(".component")) {
                itemMenu.menuToggle = false;
                document.removeEventListener("click", listener, false);
            }
        } else {
            if (event.target.closest(".todo__item").getAttribute("todo-id") !== item.getAttribute("todo-id")) {
                itemMenu.menuToggle = false;
                document.removeEventListener("click", listener, false);
            }
        }
    };

    document.addEventListener("click", listener, false);
}

// <!-- ? Items list function -->

function hoverFocusedItem(id) {
    getItemInDocById(id).classList.add("hover");
}

function blurFocusedItem() {
    document.querySelectorAll(".todo__item").forEach((el) => el.classList.remove("hover"));
}

// <!-- ? Dop functions -->

function setKeyListener() {
    document.addEventListener("keydown", (event) => {
        if(event.key === "Delete" ) {
            if(arrowObject.value) {
                arrows.value.forEach((el, index) => {
                    if(el.id === arrowObject.value.getAttribute("arrow-id")) {
                        console.log("123")
                        arrows.value.splice(index, 1);
                    }

                    document.getElementById("area").innerHTML = '';
                    arrows.value.forEach((el) => {
                        setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
                    });

                    if(!arrows.value.length) {
                        document.getElementById("area").innerHTML = '';
                    }
                })
            }
        }
    })
}

onMounted(() => {
    let area = document.getElementById("area");

    area.setAttribute("width", window.innerWidth);
    area.setAttribute("height", window.innerHeight);

    area.addEventListener("click", (event) => {
        if(event.target.closest(".arrow__line") !== null) {
            arrowObject.value = event.target.closest(".arrow__line");
            event.target.closest(".arrow__line").classList.add("focused");
        }else{
            arrowObject.value = null;
        }
    })

    arrows.value.forEach((el) => {
        setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
    });

    window.addEventListener("resize", () => {
        arrows.value.forEach((el) => {
            setArrows(el, getItemInDocById(el.firstItem), getItemInDocById(el.secondItem));
        });
    });

    setKeyListener();
});
</script>

<style lang="scss">
@use "@/assets/scss/fonts";
@use "@/assets/scss/null";
@use "@/assets/scss/vars";

html {
    font-family: "Montserrat", "Arial", "sans-serif";
}

.main {
    background-color: vars.$color-g-black;
    width: 100%;
    min-height: 100vh;

    .wrapper {
        position: relative;
        height: 100vh;
        overflow-x: hidden;
    }

    .todo__item {
        position: absolute;
        min-width: 400px;
        min-height: 100px;
        z-index: 10;
        isolation: isolate;

        .todo__item_wrapper {
            @include vars.mix-default-item;
            padding: 25px 15px;
            border-radius: 16px;

            max-height: 600px;
            overflow-y: auto;
        }

        .text {
            font-size: 14px;
            font-weight: 400;
            color: vars.$color-g-white;
        }

        .menu__toggle {
            position: absolute;
            top: 10px;
            right: 10px;
            color: vars.$color-g-white;
            z-index: 10;

            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;

            width: 16px;
            height: 16px;

            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .line {
                display: block;
                width: 16px;
                height: 2px;
                background-color: vars.$color-g-white;
                transition: 0.5s;
            }

            &[menu-toggle="open"] {
                .line {
                    &:nth-child(1) {
                        transform: translate(0, 6px) rotateZ(45deg);
                    }
                    &:nth-child(2) {
                        width: 0;
                    }
                    &:nth-child(3) {
                        transform: translate(0, -6px) rotateZ(-45deg);
                    }
                }
            }
        }

        .todo__item_menu {
            position: absolute;
            top: 35px;
            right: 35px;
            z-index: -1;
            isolation: isolate;
            transform-origin: center;
            width: 100px;
            height: 100px;

            .list {
                pointer-events: none;
                list-style: none;
                padding: 0;
                .list__item {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: vars.$color-g-white;
                    bottom: -5px;
                    left: -5px;
                    opacity: 0;
                    transition: all 0.24s ease-in-out;
                    transform-origin: center;

                    button {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        span {
                            font-size: 20px;
                        }
                        &:active {
                            transform: scale(0.9);
                        }
                    }

                    &:nth-child(1) {
                        background: vars.$gradient-g-yellow;
                    }
                    &:nth-child(2) {
                        background: vars.$gradient-g-purple;
                    }
                    &:nth-child(3) {
                        background: vars.$gradient-g-blue;
                    }
                    &:nth-child(4) {
                        background: vars.$gradient-g-green;
                    }
                    &:nth-child(5) {
                        background: vars.$gradient-g-red;
                    }
                }
            }
        }

        &[menu-toggle="open"] {
            z-index: 400 !important;
            .menu__toggle {
                z-index: 1000;
            }
            .todo__item_menu .list {
                pointer-events: auto;
                .list__item {
                    opacity: 1;
                    &:nth-child(1) {
                        left: -50px;
                        bottom: 70px;
                    }
                    &:nth-child(2) {
                        left: 10px;
                        bottom: 90px;
                    }
                    &:nth-child(3) {
                        left: 70px;
                        bottom: 70px;
                    }
                    &:nth-child(4) {
                        left: 90px;
                        bottom: 10px;
                    }
                    &:nth-child(5) {
                        left: 70px;
                        bottom: -50px;
                    }
                }
            }
        }

        span.locked__status {
            position: absolute;
            top: 0;
            left: 0;
            color: vars.$color-g-white;
            font-size: 24px;

            transform: translate(0, -120%);
            opacity: 0.5;
        }

        &[menu-type="menu-right-top"] {
            .todo__item_menu {
                top: 35px;
                right: 35px;
                transform: translate(100%, -100%);
            }
        }

        &[menu-type="menu-right-bottom"] {
            .todo__item_menu {
                top: -35px;
                right: 35px;
                transform: translate(100%, 100%) rotate(90deg);

                .list .list__item {
                    transform: rotateZ(-90deg);
                }
            }
        }

        &[menu-type="menu-left-top"] {
            .todo__item_menu {
                top: 35px;
                left: 35px;
                transform: translate(-100%, -100%) rotate(-90deg);

                .list .list__item {
                    transform: rotateZ(90deg);
                }
            }
        }

        &[menu-type="menu-left-bottom"] {
            .todo__item_menu {
                top: -35px;
                left: 35px;
                transform: translate(-100%, 100%) rotate(-180deg);

                .list .list__item {
                    transform: rotateZ(180deg);
                }
            }
        }

        .draggble {
            position: absolute;
            top: 0;
            right: 35px;
            height: 25px;
            width: 80%;

            cursor: grab;
        }

        &.drag {
            .todo__item_wrapper {
                border: 1px solid vars.$color-g-white;
            }
        }

        &.hover {
            .todo__item_wrapper {
                box-shadow: rgba(255, 255, 255, 0.15) 0px 3px 9px;
            }
        }
    }

    .items__none {
        position: absolute;
        z-index: 200;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: vars.$color-g-white;

        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
            font-size: 18px;
            font-weight: 400;
            opacity: 0.5;
            margin-bottom: 15px;
        }

        button.items__none_button {
            color: vars.$color-g-white;
            padding: 10px 20px;
            border: 1px solid vars.$color-g-white-02;
            display: flex;
            align-items: center;
            border-radius: 8px;

            span:first-child {
                margin-right: 10px;
            }
        }
    }

    .textAreaHeightResize {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        min-width: 100px;
        z-index: 100;
        line-height: 18px;

        visibility: hidden;
        pointer-events: 0;
        z-index: -1;
    }

    .todo__arrow {
        position: absolute;
        background-color: red;
        height: 10px;
        top: 50%;
        isolation: isolate;
        z-index: 0;

        .arrow {
            position: absolute;
            top: 50%;
            left: 50%;
            height: 2px;
            background-color: vars.$color-g-white;
            z-index: 1;

            &::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 100%;
                width: 10px;
                height: 10px;
                background-color: vars.$color-g-white;
                transform: translate(-50%, -50%);
            }
        }
    }

    #area {
        display: block;
        width: 100%;
        height: 100%;
        z-index: 100;

        g {
            cursor: pointer;
            fill: rgba(255, 255, 255, .7);
            transition: fill .12s ease-in;
            .line__main {
                stroke: rgba(255, 255, 255, .7);
                transition: fill .12s ease-in;
            }

            &.focused {
                fill: red;
                .line__main {
                    stroke: red;
                }
            }
        }
    }

    button {
        border: 0;
        background-color: transparent;
        outline: none;
        cursor: pointer;
    }
}
</style>
