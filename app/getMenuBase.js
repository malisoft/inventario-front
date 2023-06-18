export const getMenuBase = (menuBase) => {
    let newMenuBase = [];

    menuBase.forEach(menu => {
        if (menu.activate) {
            let baseMenu = { _id: menu._id._id, submenus: [] }
            menu.submenus.forEach(submenu => {
                if (submenu.activate) {
                    baseMenu.submenus.push({ _id: submenu._id._id })
                }
            });
            newMenuBase.push(baseMenu);
        }
    });
    return newMenuBase;
}