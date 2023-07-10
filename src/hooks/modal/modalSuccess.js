import { reactive } from "vue";

export function useModalSuccess(modalSuccess) {
    const item = reactive({});

    for (const [key, value] of Object.entries(modalSuccess)) {
        item[key] = value;
    }

    const modalShow = (content) => {
        for (const [key, value] of Object.entries(content)) {
            item[key] = value;
        }
    };

    const modalJustClose = () => {
        item.show = false;
        item.message = "";
        item.func = null;
        item.btn = null;
    };

    return {
        item,

        modalShow,
        modalJustClose,
    };
}
