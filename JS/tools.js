function changeContent(tagId){

    if (tagId == "instructs") {
        document.getElementById('rtdc-table').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');
        document.getElementById('rtdc-refs').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');

        document.getElementById('rtdc-help').setAttribute('class', 'col-sm-10 col-sm-offset-1 visible');

        return;
    }

    if (tagId == "calc-table") {
        document.getElementById('rtdc-help').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');
        document.getElementById('rtdc-refs').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');

        document.getElementById('rtdc-table').setAttribute('class', 'col-sm-10 col-sm-offset-1 visible');

        return;
    }

    if (tagId == "manobs-ref") {
        document.getElementById('rtdc-help').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');
        document.getElementById('rtdc-table').setAttribute('class', 'col-sm-10 col-sm-offset-1 hidden');

        document.getElementById('rtdc-refs').setAttribute('class', 'col-sm-10 col-sm-offset-1 visible');

        return;
    }

    alert("Problems Arose...");
}
