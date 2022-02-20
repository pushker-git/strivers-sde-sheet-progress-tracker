// set the view count to less than 10 to avoid forcefully login

function createHtmlMarkUp() {
    const itemsFromCache = getItemFromCache();
    let isChecked = false;
    let totalQ =0;
    let completedQ = 0;
    $('details table').each((index, table) => {
        $(table).find('tbody tr:first').append("<th><strong>Progress</strong></th>");
        const tableIndex = `t_${++index}`
        $(table).find('tbody tr').not(':first').each((idx, row) => {
            let id = `${tableIndex}_q_${idx}`;
            isChecked = itemsFromCache.has(id) ? true: false;
            let template = `<td><label><input type='checkbox' class='js-progress-box' id=${id}  ${isChecked ? "checked": "" } />Done </label></td>`;
            $(row).append(template);
            totalQ++;
            if(isChecked) completedQ++;
        });

    });

    /**
     * Added sidebar widget to track overall progress
     */
    let progressPercentage = Math.round((completedQ/totalQ)*100);
    $('#secondary').append(`
        <aside id="block-js-progess" class="widget widget_block clearfix" >
            <div class="wp-block-group"><div class="wp-block-group__inner-container">
            <label for="js-progress-bar">Over all progess: ${completedQ}/${totalQ}</label>
            <progress id="js-progress-bar" value="${progressPercentage}" max="100"> ${progressPercentage}% </progress>
            </div></div>
        </aside>
    `)
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

