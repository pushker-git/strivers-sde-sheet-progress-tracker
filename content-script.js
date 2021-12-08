// set the view count to less than 10 to avoid forcefully login

function createHtmlMarkUp() {
    const itemsFromCache = getItemFromCache();
    let isChecked = false;
    $('table.has-black-color').each((index, table) => {
        $(table).find('thead tr:last').append("<th>Progress</th>");
        const tableIndex = `t_${++index}`
        $(table).find('tbody tr').each((index, row) => {
            let id = $(row).find('td:first').text().trim().replace(/\./g, '');
            id = `${tableIndex}_q_${id}`;
            isChecked = itemsFromCache.has(id) ? true: false;
            let template = `<td><label><input type='checkbox' class='js-progress-box' id=${id}  ${isChecked ? "checked": "" } />Done </label></td>`;
            $(row).append(template);
        });

    });
}

function bindStateChangeEvent() {
    $("table").on('click', '.js-progress-box', onCheckBoxClicked);
}
function onCheckBoxClicked(e) {
    if (this.checked) {
        storeItemToCache(this.id);
    } else {
        deleteItemFromCache(this.id);
    }
}

function storeItemToCache(item) {
    let uniqueItems = getItemFromCache();
    uniqueItems.add(item);
    localStorage.setItem('sdesheetprogressItems', JSON.stringify([...uniqueItems]));
}

function deleteItemFromCache(item) {
    let uniqueItems = getItemFromCache();
    if (uniqueItems.has(item)) {
        uniqueItems.delete(item);
        localStorage.setItem('sdesheetprogressItems', JSON.stringify([...uniqueItems]));
    }
}

function getItemFromCache() {
    let items = localStorage.getItem('sdesheetprogressItems');
    if (items) {
        return new Set(JSON.parse(items));
    } else {
        return new Set();
    }

}

function init() {
    createHtmlMarkUp();
    bindStateChangeEvent();
}

init();

